'use client';
import React, { useState } from 'react';
import { areCompatible, generateMatchCode } from '@/utils/zodiac';
import { getActiveUsers, updateUserMatch } from '@/services/firebaseService';

const MatchingAlgorithm = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);

  const runMatchingAlgorithm = async () => {
    setIsRunning(true);
    
    try {
      // Get all active users from Firebase
      const allUsers = await getActiveUsers();
      const unmatchedUsers = allUsers.filter(user => !user.matched);

      // Multi-phase matching algorithm
      const matches = [];
      const matchedUsers = new Set();
      const groups = [];

      // Phase 1: Try to match compatible pairs
      const compatiblePairs = [];
      
      // Find all compatible pairs first
      for (let i = 0; i < unmatchedUsers.length; i++) {
        if (matchedUsers.has(unmatchedUsers[i].id)) continue;
        
        for (let j = i + 1; j < unmatchedUsers.length; j++) {
          if (matchedUsers.has(unmatchedUsers[j].id)) continue;
          
          const user1 = unmatchedUsers[i];
          const user2 = unmatchedUsers[j];
          
          if (areCompatible(user1.zodiacSign, user2.zodiacSign)) {
            compatiblePairs.push([user1, user2]);
          }
        }
      }
      
      // Sort compatible pairs by some criteria (could be random or based on compatibility score)
      compatiblePairs.sort(() => Math.random() - 0.5); // Randomize to avoid bias
      
      // Create matches from compatible pairs
      for (const [user1, user2] of compatiblePairs) {
        if (matchedUsers.has(user1.id) || matchedUsers.has(user2.id)) continue;
        
        const matchCode = generateMatchCode(user1.zodiacSign, user2.zodiacSign);
        
        matches.push({
          user1: {
            id: user1.id,
            name: user1.fullName,
            sign: user1.zodiacSign
          },
          user2: {
            id: user2.id,
            name: user2.fullName,
            sign: user2.zodiacSign
          },
          matchCode
        });

        matchedUsers.add(user1.id);
        matchedUsers.add(user2.id);

        // Update user data in Firebase
        await updateUserMatch(user1.id, {
          matchCode,
          matchedWith: user2.id
        });

        await updateUserMatch(user2.id, {
          matchCode,
          matchedWith: user1.id
        });
      }

      // Phase 2: Create groups of 3 for remaining unmatched users
      const remainingUsers = unmatchedUsers.filter(user => !matchedUsers.has(user.id));
      if (remainingUsers.length >= 3) {
        // Create groups of 3, but leave some flexibility for the final group
        const groupsOf3 = Math.floor(remainingUsers.length / 3);
        const extraUsers = remainingUsers.length % 3;
        
        // Create complete groups of 3
        for (let i = 0; i < groupsOf3; i++) {
          const startIdx = i * 3;
          const user1 = remainingUsers[startIdx];
          const user2 = remainingUsers[startIdx + 1];
          const user3 = remainingUsers[startIdx + 2];

          if (matchedUsers.has(user1.id) || matchedUsers.has(user2.id) || matchedUsers.has(user3.id)) continue;

          const matchCode = generateMatchCode(user1.zodiacSign, user2.zodiacSign, user3.zodiacSign);
          
          groups.push({
            users: [
              {
                id: user1.id,
                name: user1.fullName,
                sign: user1.zodiacSign
              },
              {
                id: user2.id,
                name: user2.fullName,
                sign: user2.zodiacSign
              },
              {
                id: user3.id,
                name: user3.fullName,
                sign: user3.zodiacSign
              }
            ],
            matchCode
          });

          matchedUsers.add(user1.id);
          matchedUsers.add(user2.id);
          matchedUsers.add(user3.id);

          // Update user data in Firebase
          await updateUserMatch(user1.id, {
            matchCode,
            matchedWith: `${user2.id},${user3.id}`
          });

          await updateUserMatch(user2.id, {
            matchCode,
            matchedWith: `${user1.id},${user3.id}`
          });

          await updateUserMatch(user3.id, {
            matchCode,
            matchedWith: `${user1.id},${user2.id}`
          });
        }
        
        // Handle extra users (1 or 2 users left)
        if (extraUsers > 0) {
          const extraStartIdx = groupsOf3 * 3;
          const extraUsersList = remainingUsers.slice(extraStartIdx);
          
          if (groups.length > 0) {
            // Add extra users to the last group
            const lastGroup = groups[groups.length - 1];
            const newMatchCode = generateMatchCode(...lastGroup.users.map(u => u.sign), ...extraUsersList.map(u => u.zodiacSign));
            
            // Update the last group
            lastGroup.users.push(...extraUsersList.map(user => ({
              id: user.id,
              name: user.fullName,
              sign: user.zodiacSign
            })));
            lastGroup.matchCode = newMatchCode;

            // Update all users in the group
            const allUserIds = lastGroup.users.map(u => u.id);
            for (const user of extraUsersList) {
              await updateUserMatch(user.id, {
                matchCode: newMatchCode,
                matchedWith: allUserIds.filter(id => id !== user.id).join(',')
              });
            }

            // Update existing users in the group
            for (const user of lastGroup.users.slice(0, -extraUsersList.length)) {
              await updateUserMatch(user.id, {
                matchCode: newMatchCode,
                matchedWith: allUserIds.filter(id => id !== user.id).join(',')
              });
            }
          } else {
            // No existing groups, create a new group with extra users
            const matchCode = generateMatchCode(...extraUsersList.map(u => u.zodiacSign));
            
            groups.push({
              users: extraUsersList.map(user => ({
                id: user.id,
                name: user.fullName,
                sign: user.zodiacSign
              })),
              matchCode
            });

            // Update all users in the group
            const allUserIds = extraUsersList.map(u => u.id);
            for (const user of extraUsersList) {
              await updateUserMatch(user.id, {
                matchCode,
                matchedWith: allUserIds.filter(id => id !== user.id).join(',')
              });
            }
          }
        }
      }

      // Phase 3: Handle any remaining users (safety net)
      const finalRemaining = unmatchedUsers.filter(user => !matchedUsers.has(user.id));
      if (finalRemaining.length > 0) {
        console.log(`Safety net: handling ${finalRemaining.length} remaining users`);
        
        // Create a group with all remaining users
        const matchCode = generateMatchCode(...finalRemaining.map(u => u.zodiacSign));
        
        groups.push({
          users: finalRemaining.map(user => ({
            id: user.id,
            name: user.fullName,
            sign: user.zodiacSign
          })),
          matchCode
        });

        // Update all users in the group
        const allUserIds = finalRemaining.map(u => u.id);
        for (const user of finalRemaining) {
          await updateUserMatch(user.id, {
            matchCode,
            matchedWith: allUserIds.filter(id => id !== user.id).join(',')
          });
        }
      }

      // Phase 4: Force match any remaining unmatched users (emergency fallback)
      const stillUnmatched = unmatchedUsers.filter(user => !matchedUsers.has(user.id));
      if (stillUnmatched.length > 0) {
        console.log(`Emergency matching ${stillUnmatched.length} remaining users`);
        
        // Create a forced group with all remaining users
        const forcedMatchCode = generateMatchCode(...stillUnmatched.map(u => u.zodiacSign));
        
        groups.push({
          users: stillUnmatched.map(user => ({
            id: user.id,
            name: user.fullName,
            sign: user.zodiacSign
          })),
          matchCode: forcedMatchCode
        });

        // Update all remaining users
        const allUserIds = stillUnmatched.map(u => u.id);
        for (const user of stillUnmatched) {
          await updateUserMatch(user.id, {
            matchCode: forcedMatchCode,
            matchedWith: allUserIds.filter(id => id !== user.id).join(',')
          });
        }
      }

      setResults({
        totalUsers: unmatchedUsers.length,
        matchesFound: matches.length,
        groupsFound: groups.length,
        matches,
        groups
      });

    } catch (error) {
      console.error('Matching algorithm error:', error);
      setResults({ error: 'Failed to run matching algorithm' });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6">
      <div className="zodiac-card">
        <h3 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--primary)' }}>
          Rasi Matching Algorithm
        </h3>
        
        <button
          onClick={runMatchingAlgorithm}
          disabled={isRunning}
          className="btn-primary w-full mb-4"
        >
          {isRunning ? 'Matching Stars...' : 'Run Matching Algorithm'}
        </button>

        {results && (
          <div className="mt-4">
            {results.error ? (
              <p className="text-red-400 text-center">{results.error}</p>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm opacity-80">
                    Total Active Users: {results.totalUsers}
                  </p>
                  <p className="text-sm opacity-80">
                    Pairs Found: {results.matchesFound}
                  </p>
                  <p className="text-sm opacity-80">
                    Groups Found: {results.groupsFound}
                  </p>
                  <p className="text-sm opacity-80">
                    Total Matched: {results.matchesFound * 2 + results.groups.reduce((sum, group) => sum + group.users.length, 0)}
                  </p>
                </div>

                {results.matches.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-center" style={{ color: 'var(--royal-blue)' }}>
                      New Pairs:
                    </h4>
                    {results.matches.map((match, index) => (
                      <div key={index} className="match-code text-sm">
                        <div className="mb-2">
                          <strong>{match.user1.name}</strong> ({match.user1.sign}) + 
                          <strong> {match.user2.name}</strong> ({match.user2.sign})
                        </div>
                        <div className="font-mono text-xs">
                          Code: {match.matchCode}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.groups.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-center" style={{ color: 'var(--olive-green)' }}>
                      New Groups:
                    </h4>
                    {results.groups.map((group, index) => (
                      <div key={index} className="match-code text-sm">
                        <div className="mb-2">
                          {group.users.map((user, userIndex) => (
                            <span key={user.id}>
                              <strong>{user.name}</strong> ({user.sign})
                              {userIndex < group.users.length - 1 ? ' + ' : ''}
                            </span>
                          ))}
                        </div>
                        <div className="font-mono text-xs">
                          Code: {group.matchCode}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingAlgorithm; 