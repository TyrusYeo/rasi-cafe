'use client';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
            Rasi Cafe
          </div>
          <div>
            <a 
              href="https://drive.google.com/file/d/188VIlKuxs0COcp3S9fLPVYoGw_gK5quQ/view?usp=sharing" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10"
              style={{ color: 'var(--royal-blue)' }}
            >
              Menu
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 