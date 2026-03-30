import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-cyan-500/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Side Links */}
        <div className="flex gap-6 text-sm font-medium text-gray-400">
          <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>

        {/* CENTERED APP NAME */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Page<span className="text-cyan-400">Done</span>
          </Link>
        </div>

        {/* Right Side Links */}
        <div className="flex gap-6 text-sm font-medium text-gray-400">
          <a href="#feedback" className="hover:text-cyan-400 transition-colors">Feedback</a>
          <button className="bg-cyan-500/10 border border-cyan-500/50 px-4 py-1 rounded-full text-cyan-400 text-xs hover:bg-cyan-500 hover:text-black transition-all">
            Get Started
          </button>
        </div>

      </div>
    </nav>
  );
}