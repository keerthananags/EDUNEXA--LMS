import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Zap
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";

// Mock data - replace with API calls
const stats = [
  { 
    title: "Total Enrollments", 
    value: "12,482", 
    change: "+12%", 
    icon: Users, 
    color: "primary",
    progress: 75 
  },
  { 
    title: "Completion Rate", 
    value: "78.4%", 
    change: "+4%", 
    icon: TrendingUp, 
    color: "secondary",
    chart: true
  },
  { 
    title: "Monthly Revenue", 
    value: "$42,910", 
    change: "+8%", 
    icon: DollarSign, 
    color: "tertiary",
    sparkline: true
  },
  { 
    title: "Average Rating", 
    value: "4.92", 
    change: "", 
    icon: Star, 
    color: "secondary",
    stars: true,
    progress: 98
  },
];

const courses = [
  {
    id: 1,
    title: "Backend Architecture",
    duration: "12h 40m",
    progress: 45,
    image: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?w=400",
  },
  {
    id: 2,
    title: "Machine Learning",
    duration: "8h 20m",
    progress: 82,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
  },
  {
    id: 3,
    title: "React Development",
    duration: "6h 30m",
    progress: 15,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
  },
  {
    id: 4,
    title: "Python for Beginners",
    duration: "10h 15m",
    progress: 60,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
  },
];

const deadlines = [
  { id: 1, title: "Design System Audit", course: "Advanced UI/UX", date: "Oct 24", urgent: true },
  { id: 2, title: "Neural Net Visual", course: "Machine Learning", date: "Oct 27", urgent: false },
];

const activities = [
  { id: 1, user: "Sarah Jenkins", action: "joined", target: "Advanced AI Ethics", time: "2 min ago", icon: Users, color: "primary" },
  { id: 2, user: "David K.", action: "completed", target: "Quantum Physics 101", time: "14 min ago", icon: Award, color: "secondary" },
  { id: 3, user: "New payment", action: "received from", target: "Marcus V.", time: "48 min ago", icon: DollarSign, color: "tertiary" },
  { id: 4, user: "Elena Rossi", action: "registered", target: "new account", time: "1 hour ago", icon: Users, color: "primary" },
];

const recommended = [
  { id: 1, title: "Digital Anthropology", category: "Humanities", lessons: 15, tag: "NEW", tagColor: "tertiary", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400" },
  { id: 2, title: "Advanced Data Viz", category: "Science", lessons: 24, tag: "TOP RATED", tagColor: "secondary", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400" },
  { id: 3, title: "Spatial Computing", category: "Tech", lessons: 10, tag: "TRENDING", tagColor: "primary", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400" },
  { id: 4, title: "AI Ethics", category: "Technology", lessons: 12, tag: "POPULAR", tagColor: "tertiary", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400" },
  { id: 5, title: "Web3 Development", category: "Blockchain", lessons: 18, tag: "HOT", tagColor: "secondary", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400" },
  { id: 6, title: "Cloud Architecture", category: "DevOps", lessons: 20, tag: "NEW", tagColor: "primary", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400" },
];

export default function NewDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("week");

  return (
    <div className="bg-[#060e20] text-[#dee5ff] min-h-screen">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <TopNavBar title="Dashboard" />
        
        <div className="p-8 max-w-7xl mx-auto space-y-8">
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
                Advanced UI/UX Design Mastery
              </h2>
              <p className="text-[#a3aac4] mb-8 max-w-md">
                Module 4: Immersive Prototyping and Interaction Patterns. Deep dive into spatial interfaces.
              </p>
              
              {/* Progress */}
              <div className="space-y-3 mb-8 max-w-md">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-indigo-400">Progress: 68%</span>
                  <span className="text-xs text-slate-500">12/18 Lessons</span>
                </div>
                <div className="w-full h-2 bg-[#192540] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 w-[68%]"></div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/courses')}
                className="w-fit flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#5764f1] to-[#c081ff] text-white rounded-full font-bold transition-all hover:shadow-[0_0_30px_rgba(87,100,241,0.5)] group cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                Resume Learning
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#091328] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
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
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-slate-400">{stat.title}</p>
                
                {stat.progress && (
                  <div className="mt-4">
                    <div className="w-full h-1.5 bg-[#192540] rounded-full overflow-hidden">
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
              className="bg-[#091328] rounded-2xl p-6 border border-white/5"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Learning Activity</h3>
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="h-48 flex items-end justify-between gap-2">
                {[
                  { day: 'Mon', value: 65 },
                  { day: 'Tue', value: 85 },
                  { day: 'Wed', value: 45 },
                  { day: 'Thu', value: 95 },
                  { day: 'Fri', value: 75 },
                  { day: 'Sat', value: 55 },
                  { day: 'Sun', value: 35 },
                ].map((item, index) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${item.value}%` }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-lg cursor-pointer hover:opacity-80"
                    />
                    <span className="text-xs text-slate-400">{item.day}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Progress Ring */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#091328] rounded-2xl p-6 border border-white/5"
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
                      stroke="#1e3a5f"
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
                      animate={{ pathLength: 0.68 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      style={{ pathLength: 0.68 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">68%</span>
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
            className="bg-[#091328] rounded-2xl p-6 border border-white/5"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Weekly Goals</h3>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Complete Lessons', current: 12, target: 15, icon: BookOpen },
                { label: 'Study Hours', current: 18, target: 20, icon: Clock },
                { label: 'Quiz Score', current: 85, target: 90, icon: Star },
              ].map((goal, index) => (
                <div key={goal.label} className="bg-[#0f1930] rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <goal.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-sm font-medium">{goal.label}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">{goal.current}/{goal.target}</span>
                    <span className="text-cyan-400">{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#192540] rounded-full overflow-hidden">
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
                <button className="text-[#7d88ff] text-sm hover:underline">View all schedule</button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {courses.map((course) => (
                  <div 
                    key={course.id}
                    className="bg-[#091328] rounded-xl p-5 hover:bg-[#0f1930] transition-all group border border-white/5 cursor-pointer"
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
                      <div className="flex-1 h-2 bg-[#192540] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-400">{course.progress}%</span>
                    </div>
                    <button className="w-full py-2 bg-[#192540] rounded-full text-xs font-bold hover:bg-[#5764f1] hover:text-white transition-colors">
                      Resume
                    </button>
                  </div>
                ))}
              </div>

              {/* Learning Hours Chart */}
              <div className="bg-[#091328] rounded-2xl p-6 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="font-bold text-lg">Learning Hours</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Past 7 Days</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#192540] rounded-full">
                      <div className="w-2 h-2 rounded-full bg-[#5764f1] shadow-[0_0_8px_rgba(87,100,241,0.6)]"></div>
                      <span className="text-[10px] font-bold text-slate-300">Design</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#192540] rounded-full">
                      <div className="w-2 h-2 rounded-full bg-[#c081ff] shadow-[0_0_8px_rgba(192,129,255,0.6)]"></div>
                      <span className="text-[10px] font-bold text-slate-300">Dev</span>
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

              {/* Recommended */}
              <div>
                <h3 className="text-2xl font-bold mb-6 tracking-tight">Recommended for You</h3>
                <div className="grid grid-cols-3 gap-6">
                  {recommended.map((item) => (
                    <div 
                      key={item.id} 
                      className="group cursor-pointer"
                      onClick={() => navigate(`/courses/${item.id}`)}
                    >
                      <div className="relative rounded-2xl overflow-hidden mb-3 aspect-[4/5] bg-[#192540]">
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
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        {item.category} • {item.lessons} Lessons
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-6">
              {/* Activity Level */}
              <div className="bg-[#141f38] rounded-xl p-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#5764f1]/10 blur-[50px] rounded-full"></div>
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#9fa7ff]" />
                  Activity Level
                </h4>
                <div className="relative flex justify-center items-center mb-8">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" fill="transparent" r="56" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle 
                      cx="64" cy="64" fill="transparent" r="56" 
                      stroke="#9fa7ff" 
                      strokeDasharray="351.85" 
                      strokeDashoffset="87.96" 
                      strokeLinecap="round"
                      strokeWidth="8"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <p className="text-2xl font-extrabold leading-none">75%</p>
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Active</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-extrabold">14</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Streak</p>
                  </div>
                  <div className="h-8 w-[1px] bg-white/10"></div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold">128</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">XP</p>
                  </div>
                  <div className="h-8 w-[1px] bg-white/10"></div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold">06</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Badges</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-[#091328] rounded-xl p-6 border border-white/5">
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#c081ff]" />
                  Upcoming Deadlines
                </h4>
                <div className="space-y-4">
                  {deadlines.map((deadline) => (
                    <div key={deadline.id} className="flex gap-4 group cursor-pointer">
                      <div className="flex flex-col items-center justify-center w-12 h-14 bg-[#192540] rounded-lg border border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Oct</span>
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
                <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">
                  View Full Calendar
                </button>
              </div>

              {/* Achievements */}
              <div className="bg-[#192540]/60 rounded-xl p-6 border border-white/10 backdrop-blur-lg">
                <h4 className="font-bold text-lg mb-4">Achievements</h4>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: Award, color: "primary", title: "Early Adopter" },
                    { icon: Star, color: "secondary", title: "Consistency Master" },
                    { icon: TrendingIcon, color: "tertiary", title: "Knowledge Luminary" },
                    { icon: Lock, color: "locked", title: "Locked" },
                  ].map((badge, i) => (
                    <div 
                      key={i} 
                      className={`w-12 h-12 rounded-full flex items-center justify-center relative group ${
                        badge.color === "locked" 
                          ? "bg-[#192540] border border-white/5 opacity-40" 
                          : `bg-gradient-to-br from-${badge.color === "primary" ? "[#5764f1]/40" : badge.color === "secondary" ? "[#9e41f5]/40" : "[#17a8ec]/40"} to-white/5`
                      }`}
                      title={badge.title}
                    >
                      <badge.icon className={`w-6 h-6 ${
                        badge.color === "primary" ? "text-[#9fa7ff]" : 
                        badge.color === "secondary" ? "text-[#c081ff]" : 
                        badge.color === "tertiary" ? "text-[#61c2ff]" : "text-slate-400"
                      }`} />
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1f2b49] text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                        {badge.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
