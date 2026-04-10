import React from 'react';
import Hero from '../components/Hero';

const Home = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Hero />
      
      {/* Brands Section Placeholder typical in dribbble designs */}
      <section className="py-12 px-6 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center opacity-50 grayscale gap-8">
          <h3 className="text-2xl font-black text-slate-400">Google</h3>
          <h3 className="text-2xl font-black text-slate-400">Microsoft</h3>
          <h3 className="text-2xl font-black text-slate-400">Coursera</h3>
          <h3 className="text-2xl font-black text-slate-400">Udemy</h3>
          <h3 className="text-2xl font-black text-slate-400">Skillshare</h3>
        </div>
      </section>
    </div>
  );
};

export default Home;
