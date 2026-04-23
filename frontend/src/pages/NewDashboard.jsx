import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Star, 
  BookOpen,
  Clock,
  MoreHorizontal,
  ChevronRight,
  Play,
  Flame,
  Calendar,
  Award,
  Lock,
  TrendingUp as TrendingIcon,
  ArrowUpRight,
  Activity,
  Target,
  Zap,
  Loader2,
  AlertCircle,
  RefreshCcw
} from "lucide-react";
import { toast } from "react-toastify";
import Skeleton from "../components/Skeleton";
import Sidebar from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";
import AIChat from "../components/AIChat";

// Production backend URL - FORCE CORRECT URL
const PROD_API_URL = 'https://edunexa-lms-zx8q.onrender.com/api';
const API_BASE_URL = PROD_API_URL; // Force production URL

console.log('NewDashboard using API_BASE_URL:', API_BASE_URL);

export default function NewDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("week");
  const [myCourses, setMyCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    completedCourses: 0,
    avgProgress: 0,
    totalLessons: 0,
    completedLessons: 0,
    studyHours: 0,
    quizScore: 0
  });
  const [error, setError] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUnauthorized = () => {
    alert('Session expired. Please login again.');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleUnauthorized();
        return;
      }

      // Fetch my enrolled courses
      const myCoursesRes = await fetch(`${API_BASE_URL}/enrollments/my-enrollments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (myCoursesRes.status === 401) {
        handleUnauthorized();
        return;
      }

      let enrolledCourses = [];
      if (myCoursesRes.ok) {
        const enrollments = await myCoursesRes.json();
        enrolledCourses = enrollments.map(enrollment => ({
          id: enrollment.course?._id || enrollment._id,
          title: enrollment.course?.title || 'Course',
          duration: enrollment.course?.duration || 'N/A',
          progress: enrollment.progress || 0,
          totalLessons: enrollment.course?.lessons?.length || enrollment.course?.lectures || 10,
          image: enrollment.course?.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400`,
          enrolled: true
        }));
        setMyCourses(enrolledCourses);
        
        // Calculate stats
        const completed = enrolledCourses.filter(c => c.progress === 100).length;
        const avgProgress = enrolledCourses.length > 0 
          ? Math.round(enrolledCourses.reduce((acc, c) => acc + c.progress, 0) / enrolledCourses.length)
          : 0;
        
        // Calculate dynamic weekly goals based on real data
        const totalLessons = enrolledCourses.reduce((acc, c) => acc + (c.totalLessons || 10), 0);
        const completedLessons = Math.round((avgProgress / 100) * totalLessons);
        const studyHours = Math.round((completedLessons * 1.5)); // Estimate 1.5 hours per lesson
        const quizScore = avgProgress > 80 ? 90 : avgProgress > 50 ? 75 : 60;

        setStats({
          totalEnrollments: enrolledCourses.length,
          completedCourses: completed,
          avgProgress: avgProgress,
          totalLessons: totalLessons,
          completedLessons: completedLessons,
          studyHours: studyHours,
          quizScore: quizScore
        });
      }

      // Fetch all available courses
      const allCoursesRes = await fetch(`${API_BASE_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (allCoursesRes.status === 401) {
        handleUnauthorized();
        return;
      }

      if (allCoursesRes.ok) {
        const courses = await allCoursesRes.json();
        const enrolledIds = new Set(enrolledCourses.map(c => c.id?.toString()));
        
        const transformedCourses = courses.map(course => ({
          id: course._id,
          title: course.title,
          category: course.category || 'Development',
          lessons: course.lessons?.length || 12,
          tag: course.price === 0 ? 'FREE' : course.price < 50 ? 'POPULAR' : 'PREMIUM',
          tagColor: course.price === 0 ? 'primary' : course.price < 50 ? 'secondary' : 'tertiary',
          image: course.thumbnail || `https://images.unsplash.com/photo-${[
            '1516321318423-f06f85e504b3',
            '1551288049-bebda4e38f71',
            '1633356122544-f134324a6cee',
            '1677442136019-21780ecad995'
          ][Math.floor(Math.random() * 4)]}?w=400`,
          enrolled: enrolledIds.has(course._id?.toString()),
          price: course.price || 0,
          level: course.level || 'beginner'
        }));
        
        setAllCourses(transformedCourses);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError(error.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/enroll/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        alert('Successfully enrolled!');
        // Refresh data
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Failed to enroll. Please try again.');
    }
  };

  // Stats data
  const statsData = [
    { 
      title: "My Courses", 
      value: stats.totalEnrollments.toString(), 
      change: "+0%", 
      icon: BookOpen, 
      color: "primary",
      progress: stats.avgProgress 
    },
    { 
      title: "Completion Rate", 
      value: `${stats.avgProgress}%`, 
      change: "+0%", 
      icon: TrendingUp, 
      color: "secondary",
      chart: true
    },
    { 
      title: "Completed", 
      value: stats.completedCourses.toString(), 
      change: "", 
      icon: Award, 
      color: "tertiary",
      sparkline: true
    },
    { 
      title: "Avg Progress", 
      value: `${stats.avgProgress}%`, 
      change: "", 
      icon: Star, 
      color: "secondary",
      stars: true,
      progress: stats.avgProgress
    },
  ];

  const deadlines = [
    { id: 1, title: "Complete Lesson", course: "Continue Learning", date: "Today", urgent: true },
    { id: 2, title: "Practice Exercise", course: "Stay on Track", date: "Tomorrow", urgent: false },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#060e20] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#091328] rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-6 border border-red-500/20"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 dark:text-white">Connection Error</h2>
            <p className="text-slate-500 text-sm mb-6">{error}</p>
            <button 
              onClick={() => { setError(null); setLoading(true); fetchDashboardData(); }}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#5764f1] text-white rounded-xl font-bold hover:bg-[#4652e0] transition-colors"
            >
              <RefreshCcw className="w-5 h-5" />
              Reconnect
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-[#060e20] min-h-screen">
        <div className="ml-64 p-8 max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-[#060e20] text-slate-900 dark:text-[#dee5ff] min-h-screen transition-colors duration-200">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <TopNavBar title="Dashboard" />
        
        <AnimatePresence mode="wait">
          <motion.div 
            key="dashboard-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-8 max-w-7xl mx-auto space-y-8"
          >
          {/* Hero Section - Continue Learning */}
          <section className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#060e20] via-[#060e20]/60 to-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200" 
              alt="Featured" 
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="relative z-20 p-12 flex flex-col justify-center max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-bold tracking-widest uppercase rounded-full">
                  Continue Learning
                </span>
                <span className="text-slate-400 text-xs">Last active 2 hours ago</span>
              </div>
              <h2 className="text-4xl font-extrabold mb-4 tracking-tighter leading-none">
                {myCourses.length > 0 ? myCourses[0].title : 'Start Your Learning Journey'}
              </h2>
              <p className="text-[#a3aac4] mb-8 max-w-md">
                {myCourses.length > 0 
                  ? `Continue with your course. You're making great progress!`
                  : 'Explore our courses and start learning today.'}
              </p>
              
              {/* Progress */}
              <div className="space-y-3 mb-8 max-w-md">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-indigo-400">
                    Progress: {myCourses.length > 0 ? myCourses[0].progress : 0}%
                  </span>
                  <span className="text-xs text-slate-500">
                    {myCourses.length > 0 ? Math.round((myCourses[0].progress / 100) * 20) : 0}/20 Lessons
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 dark:bg-[#192540] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                    style={{ width: `${myCourses.length > 0 ? myCourses[0].progress : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate(myCourses.length > 0 ? `/courses/${myCourses[0].id}` : '/courses')}
                className="w-fit flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#5764f1] to-[#c081ff] text-white rounded-full font-bold transition-all hover:shadow-[0_0_30px_rgba(87,100,241,0.5)] group cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                {myCourses.length > 0 ? 'Resume Learning' : 'Browse Courses'}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-[#091328] rounded-2xl p-6 border border-gray-200 dark:border-white/5 hover:border-indigo-200 dark:hover:border-white/10 shadow-sm transition-all cursor-pointer"
                onClick={() => navigate('/analytics')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    stat.color === 'primary' ? 'bg-cyan-500/20 text-cyan-400' :
                    stat.color === 'secondary' ? 'bg-purple-500/20 text-purple-400' :
                    stat.color === 'tertiary' ? 'bg-pink-500/20 text-pink-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold flex items-center gap-1 ${
                    stat.change.includes('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <ArrowUpRight className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
                
                {stat.progress && (
                  <div className="mt-4">
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-[#192540] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {stat.chart && (
                  <div className="flex items-end gap-1 h-12 mt-4">
                    {[40, 60, 50, 80, 78, 65, 70].map((h, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-t-sm ${i === 4 ? "bg-[#c081ff]" : "bg-[#c081ff]/20"}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                )}

                {stat.stars && (
                  <div className="flex text-yellow-400 gap-0.5 mt-4">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                    <Star className="w-3 h-3 fill-current opacity-50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-[#091328] rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Learning Activity</h3>
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="h-48 flex items-end justify-between gap-2">
                {(() => {
                  // Generate dynamic activity data based on user stats
                  const baseActivity = stats.avgProgress > 0 ? Math.min(80, stats.avgProgress + 20) : 30;
                  const activityData = [
                    { day: 'Mon', value: Math.min(100, Math.max(20, baseActivity + Math.random() * 20 - 10)) },
                    { day: 'Tue', value: Math.min(100, Math.max(20, baseActivity + Math.random() * 20 - 10)) },
                    { day: 'Wed', value: Math.min(100, Math.max(20, baseActivity + Math.random() * 20 - 10)) },
                    { day: 'Thu', value: Math.min(100, Math.max(20, baseActivity + Math.random() * 20 - 10)) },
                    { day: 'Fri', value: Math.min(100, Math.max(20, baseActivity + Math.random() * 20 - 10)) },
                    { day: 'Sat', value: Math.min(100, Math.max(10, baseActivity * 0.6 + Math.random() * 10)) },
                    { day: 'Sun', value: Math.min(100, Math.max(10, baseActivity * 0.5 + Math.random() * 10)) },
                  ];
                  return activityData.map((item, index) => (
                    <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${item.value}%` }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-lg cursor-pointer hover:opacity-80"
                      />
                      <span className="text-xs text-slate-400">{item.day}</span>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>

            {/* Progress Ring */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-[#091328] rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Course Progress</h3>
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      className="stroke-gray-100 dark:stroke-[#1e3a5f]"
                      strokeWidth="12"
                      fill="none"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: stats.avgProgress / 100 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{stats.avgProgress}%</span>
                    <span className="text-sm text-slate-400">Completed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Weekly Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-[#091328] rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Weekly Goals</h3>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Complete Lessons', current: stats.completedLessons || 0, target: stats.totalLessons || 10, icon: BookOpen },
                { label: 'Study Hours', current: stats.studyHours || 0, target: 30, icon: Clock },
                { label: 'Quiz Score', current: stats.quizScore || 0, target: 100, icon: Star },
              ].map((goal, index) => (
                <div key={goal.label} className="bg-gray-50 dark:bg-[#0f1930] rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-purple-500/20 rounded-lg flex items-center justify-center">
                      <goal.icon className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                    </div>
                    <span className="text-sm font-medium">{goal.label}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">{goal.current}/{goal.target}</span>
                    <span className="text-cyan-400">{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-[#192540] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Courses */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-end">
                <h3 className="text-2xl font-bold tracking-tight">My Courses</h3>
                <button 
                  onClick={() => navigate('/courses')}
                  className="text-[#7d88ff] text-sm hover:underline"
                >
                  View all courses
                </button>
              </div>
              
              {myCourses.length === 0 ? (
                <div className="bg-white dark:bg-[#091328] rounded-xl p-8 text-center border border-gray-200 dark:border-white/5 shadow-sm">
                  <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <h4 className="text-lg font-bold mb-2">No courses yet</h4>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">Enroll in a course to start learning!</p>
                  <button 
                    onClick={() => navigate('/courses')}
                    className="px-6 py-2 bg-gradient-to-r from-[#5764f1] to-[#c081ff] text-white rounded-full font-bold shadow-lg shadow-indigo-500/20"
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
              <div className="grid grid-cols-2 gap-6">
                {myCourses.map((course) => (
                  <div 
                    key={course.id}
                    className="bg-white dark:bg-[#091328] rounded-xl p-5 hover:bg-gray-50 dark:hover:bg-[#0f1930] transition-all group border border-gray-200 dark:border-white/5 cursor-pointer shadow-sm"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-bold text-lg mb-2">{course.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-[#a3aac4] mb-4">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-[#192540] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-400">{course.progress}%</span>
                    </div>
                    <button className="w-full py-2 bg-gray-100 dark:bg-[#192540] text-gray-700 dark:text-white rounded-full text-xs font-bold hover:bg-indigo-500 dark:hover:bg-[#5764f1] hover:text-white transition-colors">
                      Resume
                    </button>
                  </div>
                ))}
              </div>
              )}

              {/* Learning Hours Chart */}
              <div className="bg-white dark:bg-[#091328] rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="font-bold text-lg">Learning Hours</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Past 7 Days</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-[#192540] rounded-full">
                      <div className="w-2 h-2 rounded-full bg-[#5764f1] shadow-[0_0_8px_rgba(87,100,241,0.6)]"></div>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Design</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-[#192540] rounded-full">
                      <div className="w-2 h-2 rounded-full bg-[#c081ff] shadow-[0_0_8px_rgba(192,129,255,0.6)]"></div>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Dev</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between h-48 px-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                    const heights = [[60, 20], [40, 35], [80, 15], [30, 45], [90, 5], [15, 0], [10, 0]];
                    return (
                      <div key={day} className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-6 bg-gradient-to-t from-[#5764f1] to-[#9fa7ff] rounded-t-lg" style={{ height: `${heights[i][0]}%` }}></div>
                        <div className="w-6 bg-gradient-to-t from-[#9e41f5] to-[#c081ff] rounded-b-lg" style={{ height: `${heights[i][1]}%` }}></div>
                        <span className="text-[10px] font-bold text-slate-500">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Available Courses */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold tracking-tight">Available Courses</h3>
                  <button 
                    onClick={() => navigate('/courses')}
                    className="px-4 py-2 bg-gray-200 dark:bg-[#192540] hover:bg-indigo-500 dark:hover:bg-[#5764f1] text-gray-700 dark:text-white rounded-lg text-sm font-bold transition"
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {allCourses.filter(c => !c.enrolled).slice(0, 6).map((item) => (
                    <div 
                      key={item.id} 
                      className="group cursor-pointer"
                      onClick={() => navigate(`/courses/${item.id}`)}
                    >
                      <div className="relative rounded-2xl overflow-hidden mb-3 aspect-[4/5] bg-gray-100 dark:bg-[#192540]">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                          <div className={`flex items-center gap-2 text-[10px] mb-1 font-bold ${
                            item.tagColor === "tertiary" ? "text-[#61c2ff]" : 
                            item.tagColor === "secondary" ? "text-[#c081ff]" : "text-[#9fa7ff]"
                          }`}>
                            <TrendingIcon className="w-3 h-3" />
                            {item.tag}
                          </div>
                          <h5 className="text-sm font-bold text-white leading-tight">{item.title}</h5>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                          {item.category} • {item.lessons} Lessons
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEnroll(item.id); }}
                          className="px-3 py-1 bg-[#5764f1] hover:bg-[#7d88ff] text-white text-[10px] font-bold rounded-full transition"
                        >
                          Enroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-6">
              {/* Activity Level */}
              <div className="bg-white dark:bg-[#141f38] rounded-xl p-6 relative overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 dark:bg-[#5764f1]/10 blur-[50px] rounded-full"></div>
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#9fa7ff]" />
                  Activity Level
                </h4>
                <div className="relative flex justify-center items-center mb-8">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" fill="transparent" r="56" className="stroke-gray-100 dark:stroke-white/5" strokeWidth="8" />
                    <circle 
                      cx="64" cy="64" fill="transparent" r="56" 
                      stroke="#9fa7ff" 
                      strokeDasharray="351.85" 
                      strokeDashoffset={351.85 * (1 - stats.avgProgress / 100)} 
                      strokeLinecap="round"
                      strokeWidth="8"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <p className="text-2xl font-extrabold leading-none">{stats.avgProgress}%</p>
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Active</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-extrabold">{stats.totalEnrollments > 0 ? Math.floor(stats.avgProgress / 10) : 0}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Day Streak</p>
                  </div>
                  <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10"></div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold">{stats.studyHours * 10}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">XP</p>
                  </div>
                  <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10"></div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold">{stats.completedCourses}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Badges</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white dark:bg-[#091328] rounded-xl p-6 border border-gray-200 dark:border-white/5 shadow-sm">
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#c081ff]" />
                  Upcoming Deadlines
                </h4>
                <div className="space-y-4">
                  {deadlines.map((deadline) => (
                    <div key={deadline.id} className="flex gap-4 group cursor-pointer">
                      <div className="flex flex-col items-center justify-center w-12 h-14 bg-gray-50 dark:bg-[#192540] rounded-lg border border-gray-200 dark:border-white/5">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Oct</span>
                        <span className="text-lg font-extrabold">{deadline.date.split(" ")[1]}</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-bold group-hover:text-[#9fa7ff] transition-colors">
                          {deadline.title}
                        </h5>
                        <p className="text-xs text-slate-500">{deadline.course}</p>
                        {deadline.urgent && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-red-400 uppercase">Urgent</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => navigate('/calendar')}
                  className="w-full mt-6 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-white rounded-xl text-xs font-bold transition-all"
                >
                  View Full Calendar
                </button>
              </div>

              {/* Achievements */}
              <div className="bg-indigo-50/50 dark:bg-[#192540]/60 rounded-xl p-6 border border-indigo-100 dark:border-white/10 backdrop-blur-lg">
                <h4 className="font-bold text-lg mb-4">Achievements</h4>
                <div className="flex flex-wrap gap-4">
                  {(() => {
                    // Generate achievements based on real data
                    const achievements = [];
                    
                    // First Course Achievement
                    if (stats.totalEnrollments >= 1) {
                      achievements.push({ icon: Award, color: "primary", title: "First Step", unlocked: true });
                    } else {
                      achievements.push({ icon: Lock, color: "locked", title: "Enroll in first course", unlocked: false });
                    }
                    
                    // Consistency Master - 50%+ progress
                    if (stats.avgProgress >= 50) {
                      achievements.push({ icon: Star, color: "secondary", title: "Consistency Master", unlocked: true });
                    } else {
                      achievements.push({ icon: Lock, color: "locked", title: "Reach 50% progress", unlocked: false });
                    }
                    
                    // Course Completer
                    if (stats.completedCourses >= 1) {
                      achievements.push({ icon: TrendingIcon, color: "tertiary", title: "Course Completer", unlocked: true });
                    } else {
                      achievements.push({ icon: Lock, color: "locked", title: "Complete a course", unlocked: false });
                    }
                    
                    // Knowledge Seeker - 3+ courses
                    if (stats.totalEnrollments >= 3) {
                      achievements.push({ icon: BookOpen, color: "primary", title: "Knowledge Seeker", unlocked: true });
                    } else {
                      achievements.push({ icon: Lock, color: "locked", title: "Enroll in 3 courses", unlocked: false });
                    }
                    
                    return achievements.map((badge, i) => (
                      <div 
                        key={i} 
                        className={`w-12 h-12 rounded-full flex items-center justify-center relative group transition-all ${
                          badge.unlocked 
                            ? `bg-gradient-to-br ${
                                badge.color === "primary" ? "from-[#5764f1]/40 to-[#5764f1]/10" : 
                                badge.color === "secondary" ? "from-[#9e41f5]/40 to-[#9e41f5]/10" : 
                                "from-[#17a8ec]/40 to-[#17a8ec]/10"
                              } hover:scale-110` 
                            : "bg-[#192540] border border-white/5 opacity-40"
                        }`}
                        title={badge.title}
                      >
                        <badge.icon className={`w-6 h-6 ${
                          badge.color === "primary" ? "text-[#9fa7ff]" : 
                          badge.color === "secondary" ? "text-[#c081ff]" : 
                          badge.color === "tertiary" ? "text-[#61c2ff]" : "text-slate-400"
                        }`} />
                        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl ${
                          badge.unlocked ? "bg-[#5764f1] text-white" : "bg-[#1f2b49] text-slate-400"
                        }`}>
                          {badge.title}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Unlocked: {(() => {
                      let count = 0;
                      if (stats.totalEnrollments >= 1) count++;
                      if (stats.avgProgress >= 50) count++;
                      if (stats.completedCourses >= 1) count++;
                      if (stats.totalEnrollments >= 3) count++;
                      return count;
                    })()}/4</span>
                    <span className="text-[#9fa7ff] font-bold">
                      {stats.completedCourses >= 1 ? "Master" : stats.avgProgress >= 50 ? "Pro" : stats.totalEnrollments >= 1 ? "Beginner" : "Newcomer"}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
          </motion.div>
        </AnimatePresence>
      </main>
      <AIChat courseTitle="Dashboard" courseContent="General learning assistance across all subjects" />
    </div>
  );
}
