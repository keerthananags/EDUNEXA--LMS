import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  TrendingUp as TrendingIcon
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
  { id: 1, title: "Digital Anthropology", category: "Humanities", lessons: 15, tag: "NEW", tagColor: "tertiary" },
  { id: 2, title: "Advanced Data Viz", category: "Science", lessons: 24, tag: "TOP RATED", tagColor: "secondary" },
  { id: 3, title: "Spatial Computing", category: "Tech", lessons: 10, tag: "TRENDING", tagColor: "primary" },
];

export default function NewDashboard() {
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
              
              <button className="w-fit flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#5764f1] to-[#c081ff] text-white rounded-full font-bold transition-all hover:shadow-[0_0_30px_rgba(87,100,241,0.5)] group">
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
                className="bg-[#091328] p-6 rounded-2xl relative overflow-hidden group border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#a3aac4] text-[10px] font-bold uppercase tracking-widest mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-extrabold">{stat.value}</h3>
                    {stat.change && (
                      <div className="flex items-center gap-1 text-emerald-400 mt-1">
                        <TrendingIcon className="w-3 h-3" />
                        <span className="text-xs font-bold">{stat.change}</span>
                      </div>
                    )}
                  </div>
                  
                  {stat.progress && (
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" fill="none" r="16" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <circle 
                          cx="18" cy="18" fill="none" r="16" 
                          stroke={stat.color === "primary" ? "#9fa7ff" : stat.color === "secondary" ? "#c081ff" : "#61c2ff"}
                          strokeDasharray="100"
                          strokeDashoffset={100 - stat.progress}
                          strokeLinecap="round"
                          strokeWidth="3"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold">{stat.progress}%</span>
                      </div>
                    </div>
                  )}
                  
                  {stat.stars && (
                    <div className="flex text-yellow-400 gap-0.5">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                      <Star className="w-3 h-3 fill-current opacity-50" />
                    </div>
                  )}
                </div>
                
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
              </motion.div>
            ))}
          </div>

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
                    className="bg-[#091328] rounded-xl p-5 hover:bg-[#0f1930] transition-all group border border-white/5"
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
                    <div key={item.id} className="group cursor-pointer">
                      <div className="relative rounded-2xl overflow-hidden mb-3 aspect-[4/5] bg-[#192540]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
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
