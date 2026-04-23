import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, BarChart3, Settings, Bell, Search, Plus, Play, LogOut } from "lucide-react";

export default function ModernDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onTabChange={setActiveTab} />;
      case "courses":
        return <CoursesView />;
      case "students":
        return <StudentsView />;
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <Dashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="bg-[#F8F9FF] dark:bg-[#060e20] min-h-screen flex font-sans transition-colors duration-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ================= NAVBAR ================= */
function Navbar({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white/80 dark:bg-[#091328]/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-white/5 transition-colors duration-200">
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-400 text-transparent bg-clip-text hover:opacity-80 transition">
        EduNexa
      </Link>

      <div className="relative w-1/3">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          placeholder="Search courses..."
          className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1a2544] outline-none focus:ring-2 focus:ring-purple-400 transition-all text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex items-center gap-4">
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
          >
            🛡️ Admin Panel
          </button>
        )}
        <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-cyan-300 rounded-full shadow-sm flex items-center justify-center text-white font-semibold">
          {user?.name?.charAt(0) || "G"}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.name || "Guest"}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || "Visitor"}</p>
        </div>
        <button 
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-400 text-white rounded-xl shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 transition-all font-semibold"
        >
          Profile
        </button>
      </div>
    </div>
  );
}

/* ================= SIDEBAR ================= */
function Sidebar({ activeTab, setActiveTab, user }) {
  const navigate = useNavigate();

  const menu = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "students", label: "Students", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-white dark:bg-[#091328] shadow-lg p-6 flex flex-col justify-between z-40 relative border-r border-gray-200 dark:border-white/5 transition-colors duration-200">
      <div>
        <Link to="/" className="block mb-10">
          <h2 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-cyan-400 text-transparent bg-clip-text">EduNexa</h2>
        </Link>
        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-cyan-400 text-white shadow-lg shadow-purple-200 dark:shadow-none"
                    : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-white/5 hover:text-purple-700 dark:hover:text-purple-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate("/enroll/1")}
          className="p-5 bg-gradient-to-br from-purple-600 to-cyan-400 text-white rounded-2xl shadow-lg cursor-pointer"
        >
          <h4 className="font-bold mb-1">Upgrade to Pro 🚀</h4>
          <p className="text-xs opacity-90">Get access to all features</p>
        </motion.div>

        {user ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-medium transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout ({user.name})</span>
          </button>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => navigate("/login")}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-400 text-white rounded-xl font-medium hover:opacity-90 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full px-4 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition"
            >
              Create Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */
function Dashboard({ onTabChange }) {
  return (
    <div className="p-8 pb-20">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-gray-800 dark:text-white"
      >
        Welcome Back 👋
      </motion.h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Students Activity" value="1,200+" delay={0.1} onClick={() => onTabChange("students")} />
        <StatCard title="Active Courses" value="35" delay={0.2} onClick={() => onTabChange("courses")} />
        <StatCard title="Monthly Revenue" value="$12.4K" delay={0.3} onClick={() => onTabChange("analytics")} />
      </div>

      {/* Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Courses</h2>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTabChange("courses")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white dark:text-[#060e20] hover:bg-gray-800 dark:hover:bg-gray-100 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Course
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseCard title="MERN Stack Masterclass" progress="80%" delay={0.1} image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" />
        <CourseCard title="React Pro Development" progress="60%" delay={0.2} image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80" />
        <CourseCard title="Node.js API Architecture" progress="40%" delay={0.3} image="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80" />
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value, delay, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      onClick={onClick}
      className="p-6 bg-white dark:bg-[#091328] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-2 transition-all cursor-pointer"
    >
      <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
      <p className="text-4xl font-extrabold bg-gradient-to-br from-purple-600 to-cyan-500 bg-clip-text text-transparent">{value}</p>
    </motion.div>
  );
}

/* ================= COURSE CARD ================= */
function CourseCard({ title, progress, delay, image }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="p-4 bg-white dark:bg-[#091328] rounded-2xl shadow-sm border border-gray-50 dark:border-white/5 flex flex-col h-full transition-colors duration-200"
    >
      <div className="relative overflow-hidden rounded-xl h-48 w-full mb-4">
        <img
          src={image || "https://images.unsplash.com/photo-1513258496099-48168024aec0"}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
          alt={title}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-purple-600 shadow-sm">
          Popular
        </div>
      </div>
      <h3 className="font-bold text-lg text-gray-800 dark:text-white tracking-tight flex-1">{title}</h3>

      <div className="mt-4 mb-4">
        <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          <span>Overall Progress</span>
          <span className="text-purple-600 dark:text-purple-400">{progress}</span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: progress }}
            transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-400"
          ></motion.div>
        </div>
      </div>

      <button className="mt-auto w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-400 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
        <Play className="w-4 h-4" />
        Continue Learning
      </button>
    </motion.div>
  );
}

/* ================= COURSES VIEW ================= */
function CoursesView() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">All Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseCard title="Full Stack Web Dev" progress="0%" delay={0.1} image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400" />
        <CourseCard title="Python for Beginners" progress="0%" delay={0.2} image="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400" />
        <CourseCard title="UI/UX Design" progress="0%" delay={0.3} image="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400" />
        <CourseCard title="Data Science" progress="0%" delay={0.4} image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400" />
        <CourseCard title="Mobile App Dev" progress="0%" delay={0.5} image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400" />
        <CourseCard title="Cloud Computing" progress="0%" delay={0.6} image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400" />
      </div>
    </div>
  );
}

/* ================= STUDENTS VIEW ================= */
function StudentsView() {
  const students = [
    { id: 1, name: "John Doe", email: "john@example.com", course: "MERN Stack", progress: "75%" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", course: "React Pro", progress: "60%" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", course: "Node.js", progress: "40%" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Students</h2>
      <div className="bg-white dark:bg-[#091328] rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-white/5">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Student</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Course</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Progress</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-gray-100 dark:border-white/5">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900 dark:text-white">{student.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{student.course}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium">
                    {student.progress}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= ANALYTICS VIEW ================= */
function AnalyticsView() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Analytics</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#091328] rounded-2xl shadow-md p-6 border border-gray-100 dark:border-white/5 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Revenue Overview</h3>
          <div className="h-48 bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-xl flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Chart Placeholder</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#091328] rounded-2xl shadow-md p-6 border border-gray-100 dark:border-white/5 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Student Growth</h3>
          <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SETTINGS VIEW ================= */
function SettingsView() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Settings</h2>
      <div className="max-w-2xl bg-white dark:bg-[#091328] rounded-2xl shadow-md p-6 border border-gray-100 dark:border-white/5 transition-colors duration-200">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input type="text" value="John Doe" className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#1a2544] outline-none text-gray-900 dark:text-white" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" value="john@example.com" className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#1a2544] outline-none text-gray-900 dark:text-white" readOnly />
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-400 text-white rounded-xl font-semibold hover:opacity-90 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
