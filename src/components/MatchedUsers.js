'use client';
import React, { useState, useEffect } from 'react';
import { getUserById, logoutUser, getAllUsers } from '@/services/firebaseService';
import StarryBackground from '@/components/StarryBackground';

const MatchedUsers = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Function to update localStorage with current user data
  const updateLocalStorage = (user) => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('currentUserId', user.id);
    } else {
      localStorage.removeItem('userData');
      localStorage.removeItem('currentUserId');
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get current user ID from localStorage
        const currentUserId = localStorage.getItem('currentUserId');
        if (currentUserId) {
          // Try to fetch complete user data from Firebase first
          try {
            const user = await getUserById(currentUserId);
            if (user) {
              setCurrentUser(user);
              // Store complete user data in localStorage for session persistence
              updateLocalStorage(user);
            } else {
              // User not found in Firebase, clear localStorage
              updateLocalStorage(null);
            }
          } catch (firebaseError) {
            // If Firebase is unavailable, try to use localStorage as fallback
            console.warn('Firebase unavailable, using localStorage fallback:', firebaseError);
            const userData = localStorage.getItem('userData');
            if (userData) {
              const user = JSON.parse(userData);
              setCurrentUser(user);
            } else {
              // No fallback data available
              updateLocalStorage(null);
            }
          }
        }

        // Get all matched users from Firebase
        const allUsers = await getAllUsers();
        const matchedUsers = allUsers.filter(user => user.matched && user.matchCode);
        setMatchedUsers(matchedUsers);
      } catch (error) {
        console.error('Error loading user data:', error);
        // If there's an error, clear localStorage and redirect to home
        updateLocalStorage(null);
        setCurrentUser(null);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    if (currentUser) {
      try {
        // Update user status to inactive in Firebase
        await logoutUser(currentUser.id);
        
        // Clear current user data from localStorage
        updateLocalStorage(null);
        setCurrentUser(null);
      } catch (error) {
        console.error('Error logging out:', error);
        alert('Error logging out. Please try again.');
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            Welcome Back
          </h2>
          <p className="mb-6 opacity-80">
            Please enter your information!
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser.matched) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="zodiac-card">
            <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: 'var(--primary)' }}>
              Welcome to Rasi Cafe :)
            </h2>
            <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: 'var(--primary)' }}>
            {currentUser.fullName}
            </h2>
            <div className="text-4xl mb-4 text-center" style={{ color: 'var(--royal-blue)' }}>
              {currentUser.zodiacSign}
            </div>
            <div className="text-center">
              <div className="inline-block animate-pulse">
                <div className="w-4 h-4 bg-primary rounded-full mx-1 inline-block"></div>
                <div className="w-4 h-4 bg-primary rounded-full mx-1 inline-block" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-4 h-4 bg-primary rounded-full mx-1 inline-block" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleLogout}
                className="btn-secondary flex-1"
              >
                Logout
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary flex-1"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Find the matched user(s)
  const getMatchedUsers = () => {
    if (!currentUser.matchedWith) return [];
    
    // Check if it's a group match (comma-separated IDs)
    if (currentUser.matchedWith.includes(',')) {
      const matchedIds = currentUser.matchedWith.split(',');
      return matchedUsers.filter(user => matchedIds.includes(user.id));
    } else {
      // Single pair match
      const matchedUser = matchedUsers.find(user => 
        user.id === currentUser.matchedWith || user.matchedWith === currentUser.id
      );
      return matchedUser ? [matchedUser] : [];
    }
  };

  const matchedUsersList = getMatchedUsers();
  const isGroupMatch = matchedUsersList.length > 1;

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <div className="zodiac-card">
          <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: 'var(--primary)' }}>
            {isGroupMatch ? 'Group match found!!!' : 'Match found!!!'}
          </h2>
          
          <div className="text-center mb-6">
            <div className="text-lg mb-2">
              <span className="font-semibold">{currentUser.fullName}</span> ({currentUser.zodiacSign})
            </div>
            <div className="text-2xl mb-2" style={{ color: 'var(--royal-blue)' }}>
              +
            </div>
            {isGroupMatch ? (
              <div className="text-lg space-y-2">
                {matchedUsersList.map((user, index) => (
                  <div key={user.id} className="flex flex-col items-center">
                    <span className="font-semibold">{user.fullName}</span>
                    <span className="text-sm opacity-80">({user.zodiacSign})</span>
                    {index < matchedUsersList.length - 1 && (
                      <div className="text-lg my-2" style={{ color: 'var(--royal-blue)' }}>
                        +
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-lg">
                <span className="font-semibold">{matchedUsersList[0]?.fullName}</span> ({matchedUsersList[0]?.zodiacSign})
              </div>
            )}
          </div>

          <div className="match-code mb-6">
            <div className="text-sm mb-2 opacity-80">Your Unique Match Code:</div>
            <div className="text-lg font-bold">
              {currentUser.matchCode}
            </div>
          </div>

          <p className="text-center mb-6 opacity-80">
            {isGroupMatch 
              ? `Use this code to find your group in the crowd! 🌟 (${matchedUsersList.length + 1} people total)`
              : 'Use this code to find each other in the crowd! 🌟'
            }
          </p>

          <button
            onClick={handleLogout}
            className="btn-secondary w-full"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchedUsers; 