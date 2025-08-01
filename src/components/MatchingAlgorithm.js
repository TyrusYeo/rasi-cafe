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

      // Simple matching algorithm
      const matches = [];
      const matchedUsers = new Set();

      for (let i = 0; i < unmatchedUsers.length; i++) {
        if (matchedUsers.has(unmatchedUsers[i].id)) continue;

        for (let j = i + 1; j < unmatchedUsers.length; j++) {
          if (matchedUsers.has(unmatchedUsers[j].id)) continue;

          const user1 = unmatchedUsers[i];
          const user2 = unmatchedUsers[j];

          if (areCompatible(user1.zodiacSign, user2.zodiacSign)) {
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

            break;
          }
        }
      }

      setResults({
        totalUsers: unmatchedUsers.length,
        matchesFound: matches.length,
        matches
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
          Cosmic Matching Algorithm
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
                    Matches Found: {results.matchesFound}
                  </p>
                </div>

                {results.matches.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-center" style={{ color: 'var(--royal-blue)' }}>
                      New Matches:
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingAlgorithm; 