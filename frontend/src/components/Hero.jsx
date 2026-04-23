import { Button } from "@chakra-ui/react";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[80vh] px-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-[#060e20] dark:to-[#0a1931] text-slate-900 dark:text-white transition-colors duration-200">
      
      <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
        Welcome to EduNexa LMS
      </h1>

      <p className="text-lg md:text-xl mb-8 max-w-2xl text-slate-600 dark:text-slate-400">
        Learn anytime, anywhere. Access high-quality courses, track your progress,
        and achieve your goals with our modern learning platform.
      </p>

      <div className="flex gap-4">
        <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95">
          Get Started
        </button>
        <button className="px-8 py-3 bg-white dark:bg-white/5 border border-indigo-200 dark:border-white/10 text-indigo-600 dark:text-white rounded-xl font-bold hover:bg-indigo-50 dark:hover:bg-white/10 transition-all active:scale-95">
          Explore Courses
        </button>
      </div>
      
    </div>
  );
};

export default Hero;