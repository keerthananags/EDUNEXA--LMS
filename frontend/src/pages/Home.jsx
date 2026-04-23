import React from 'react';
import Hero from "../components/Hero";

const Home = () => {
  return (
    <div className="bg-white dark:bg-[#060e20] min-h-screen transition-colors duration-200">
      <Hero />
      
      {/* Brands Section Placeholder typical in dribbble designs */}
      <section className="py-12 px-6 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#091328] transition-colors duration-200">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center opacity-50 grayscale gap-8">
          <h3 className="text-2xl font-black text-slate-400 dark:text-slate-500">Google</h3>
          <h3 className="text-2xl font-black text-slate-400 dark:text-slate-500">Microsoft</h3>
          <h3 className="text-2xl font-black text-slate-400 dark:text-slate-500">Coursera</h3>
          <h3 className="text-2xl font-black text-slate-400 dark:text-slate-500">Udemy</h3>
          <h3 className="text-2xl font-black text-slate-400 dark:text-slate-500">Skillshare</h3>
        </div>
      </section>
    </div>
  );
};

export default Home;
