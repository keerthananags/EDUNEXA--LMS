import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-900/50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} EduNexa LMS. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-slate-400 hover:text-violet-400 transition-colors">Privacy Policy</a>
          <a href="#" className="text-slate-400 hover:text-violet-400 transition-colors">Terms of Service</a>
          <a href="#" className="text-slate-400 hover:text-violet-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
