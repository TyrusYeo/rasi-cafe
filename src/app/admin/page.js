'use client';
import React, { useState, useEffect } from 'react';
import StarryBackground from '@/components/StarryBackground';
import MatchingAlgorithm from '@/components/MatchingAlgorithm';
import { getUserStats, getAllUsers } from '@/services/firebaseService';

export default function AdminPage() {
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    matched: 0,
    inactive: 0
  });

  useEffect(() => {
    updateStats();
  }, []);

  const updateStats = async () => {
    try {
      const stats = await getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all user data? This cannot be undone.')) {
      // Note: In a production app, you would implement a Firebase function to clear all data
      // For now, we'll just clear localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('currentUserId');
      alert('Local data cleared. Firebase data would need to be cleared manually.');
      updateStats();
    }
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <div className="relative z-10 min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
              Cosmic Admin Panel
            </h1>
            <p className="text-lg opacity-80">
              Manage the cosmic matching system
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="zodiac-card text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                {userStats.total}
              </div>
              <div className="text-sm opacity-80">Total Users</div>
            </div>
            
            <div className="zodiac-card text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--royal-blue)' }}>
                {userStats.active}
              </div>
              <div className="text-sm opacity-80">Active Users</div>
            </div>
            
            <div className="zodiac-card text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--olive-green)' }}>
                {userStats.matched}
              </div>
              <div className="text-sm opacity-80">Matched Users</div>
            </div>
            
            <div className="zodiac-card text-center">
              <div className="text-2xl font-bold opacity-60">
                {userStats.inactive}
              </div>
              <div className="text-sm opacity-80">Inactive Users</div>
            </div>
          </div>

          {/* Matching Algorithm */}
          <MatchingAlgorithm />

          {/* Admin Actions */}
          <div className="mt-8">
            <div className="zodiac-card">
              <h3 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--primary)' }}>
                Admin Actions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={updateStats}
                  className="btn-secondary"
                >
                  Refresh Stats
                </button>
                
                <button
                  onClick={clearAllData}
                  className="btn-secondary"
                  style={{ borderColor: '#ef4444', color: '#ef4444' }}
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="mt-8">
            <div className="zodiac-card">
              <h3 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--primary)' }}>
                Recent Users
              </h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(() => {
                  const [recentUsers, setRecentUsers] = useState([]);
                  
                  useEffect(() => {
                    const loadRecentUsers = async () => {
                      try {
                        const users = await getAllUsers();
                        setRecentUsers(users.slice(0, 10));
                      } catch (error) {
                        console.error('Error loading recent users:', error);
                      }
                    };
                    loadRecentUsers();
                  }, []);
                  
                  return recentUsers.map((user, index) => (
                    <div key={user.id || index} className="flex justify-between items-center p-2 bg-white bg-opacity-5 rounded">
                      <div>
                        <span className="font-medium">{user.fullName}</span>
                        <span className="text-sm opacity-60 ml-2">
                          ({user.zodiacSign}) - {user.birthMonth}/{user.birthDay}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className={`px-2 py-1 rounded ${
                          user.status === 'active' ? 'bg-green-500 bg-opacity-20 text-green-300' :
                          user.status === 'inactive' ? 'bg-red-500 bg-opacity-20 text-red-300' :
                          'bg-gray-500 bg-opacity-20 text-gray-300'
                        }`}>
                          {user.status}
                        </span>
                        {user.matched && (
                          <span className="ml-2 px-2 py-1 rounded bg-blue-500 bg-opacity-20 text-blue-300">
                            matched
                          </span>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 