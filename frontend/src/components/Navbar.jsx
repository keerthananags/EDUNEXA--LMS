import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <header className="absolute top-0 w-full z-50 py-6 px-4 md:px-12 flex justify-between items-center bg-transparent">
      <div className="flex items-center gap-12">
        <Link to="/" className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-lg font-bold">E</span>
          </div>
          EduNexa
        </Link>
        <nav className="hidden lg:flex gap-8">
          <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">Home</Link>
          <Link to="/courses" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">Courses</Link>
          <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">Dashboard</Link>
          <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">About Us</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link to="/login" className="px-6 py-2.5 rounded-full font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Log In</Link>
        <Link to="/register" className="px-6 py-2.5 rounded-full font-bold bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-blue-600 dark:hover:bg-blue-400 transition-all shadow-md">Sign Up</Link>
      </div>
    </header>
  );
};

export default Navbar;
