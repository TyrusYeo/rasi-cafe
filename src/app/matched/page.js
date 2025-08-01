'use client';
import React from 'react';
import MatchedUsers from '@/components/MatchedUsers';
import StarryBackground from '@/components/StarryBackground';

export default function MatchedPage() {
  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <div className="relative z-10 min-h-screen px-4 py-8 pt-20">
        <div className="max-w-4xl mx-auto">
          <MatchedUsers />
        </div>
      </div>
    </div>
  );
} 