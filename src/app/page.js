'use client';
import React, { useState, useEffect } from 'react';
import StarryBackground from '@/components/StarryBackground';
import { getZodiacSign, monthNames, generateDays } from '@/utils/zodiac';
import { addUser, getUserById } from '@/services/firebaseService';

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: '',
    birthMonth: '',
    birthDay: ''
  });
  const [zodiacSign, setZodiacSign] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [existingUser, setExistingUser] = useState(null);

  // Check for existing user on component mount
  useEffect(() => {
    const loadExistingUser = async () => {
      try {
        const currentUserId = localStorage.getItem('currentUserId');
        if (currentUserId) {
          // Try to fetch complete user data from Firebase first
          try {
            const user = await getUserById(currentUserId);
            if (user) {
              setExistingUser(user);
              // Store complete user data in localStorage for session persistence
              localStorage.setItem('userData', JSON.stringify(user));
            } else {
              // User not found in Firebase, clear localStorage
              localStorage.removeItem('userData');
              localStorage.removeItem('currentUserId');
              setExistingUser(null);
            }
          } catch (firebaseError) {
            // If Firebase is unavailable, try to use localStorage as fallback
            console.warn('Firebase unavailable, using localStorage fallback:', firebaseError);
            const userData = localStorage.getItem('userData');
            if (userData) {
              const user = JSON.parse(userData);
              setExistingUser(user);
            } else {
              // No fallback data available
              localStorage.removeItem('currentUserId');
              setExistingUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Error loading existing user:', error);
        // If there's an error, clear localStorage
        localStorage.removeItem('userData');
        localStorage.removeItem('currentUserId');
        setExistingUser(null);
      }
    };

    loadExistingUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.fullName && formData.birthMonth && formData.birthDay) {
      try {
        const sign = getZodiacSign(formData.birthMonth, formData.birthDay);
        setZodiacSign(sign);
        setIsSubmitted(true);
        
        // Store user data in Firebase
        const userData = {
          fullName: formData.fullName,
          birthMonth: formData.birthMonth,
          birthDay: formData.birthDay,
          zodiacSign: sign
        };
        
        const savedUser = await addUser(userData);
        
        // Store complete user data from Firebase in localStorage for session management
        localStorage.setItem('currentUserId', savedUser.id);
        localStorage.setItem('userData', JSON.stringify(savedUser));
      } catch (error) {
        console.error('Error saving user:', error);
        alert('Error saving user data. Please try again.');
      }
    }
  };

  // If user already exists, redirect to matched page
  if (existingUser) {
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
              Sit back, and grab a drink :)
            </h2>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            {existingUser.fullName}!
            </h2>
            <p className="mb-6 opacity-80">
              Sip Slowly, Stay Awhile...
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/matched'}
                className="btn-primary w-full"
              >
                View My Status
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('userData');
                  localStorage.removeItem('currentUserId');
                  setExistingUser(null);
                }}
                className="btn-secondary w-full"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted && zodiacSign) {
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <div className="zodiac-card">
              <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: 'var(--primary)' }}>
                Welcome to Rasi Cafe, sit back, and grab a drink :)
              </h2>
              <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: 'var(--primary)' }}>
              {formData.fullName}
              </h2>
              <div className="text-4xl mb-4 text-center" style={{ color: 'var(--royal-blue)' }}>
                {zodiacSign}
              </div>
              <div className="text-center">
                <div className="inline-block animate-pulse">
                  <div className="w-4 h-4 bg-primary rounded-full mx-1 inline-block"></div>
                  <div className="w-4 h-4 bg-primary rounded-full mx-1 inline-block" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-4 h-4 bg-primary rounded-full mx-1 inline-block" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
              Rasi Cafe
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2 opacity-80">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-input w-full"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="birthMonth" className="block text-sm font-medium mb-2 opacity-80">
                  Birth Month
                </label>
                <select
                  id="birthMonth"
                  name="birthMonth"
                  value={formData.birthMonth}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  required
                >
                  <option value="">Month</option>
                  {monthNames.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="birthDay" className="block text-sm font-medium mb-2 opacity-80">
                  Birth Day
                </label>
                <select
                  id="birthDay"
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  required
                >
                  <option value="">Day</option>
                  {generateDays().map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={!formData.fullName || !formData.birthMonth || !formData.birthDay}
            >
              Connect the stars ✨
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}
