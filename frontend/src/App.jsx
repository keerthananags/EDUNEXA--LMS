import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NewDashboard from "./pages/NewDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/Admin";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Students from "./pages/Students";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";

import Resources from "./pages/Resources";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }
  return children;
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role === "admin") return <Navigate to="/admin" />;
  return <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Root redirects based on auth status */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          
          {/* Protected user routes */}
          <Route path="/dashboard" element={<ProtectedRoute><NewDashboard /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/courses/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute adminOnly={true}><Students /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          
          {/* Protected admin routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      login(data, data.token);
      // Redirect based on role
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1">Start your learning journey today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create a password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Role Selector Toggle */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowRoleSelect(!showRoleSelect)}
              className="text-sm text-gray-500 hover:text-purple-600 underline"
            >
              {showRoleSelect ? "Hide role options" : "Register as Admin?"}
            </button>
            <span className="text-xs text-gray-400">Current: {role}</span>
          </div>

          {/* Role Selector Dropdown */}
          {showRoleSelect && (
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <label className="block text-sm font-medium text-purple-700 mb-2">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="student">Student (User)</option>
                <option value="admin">Administrator</option>
                <option value="instructor">Instructor</option>
              </select>
              <p className="text-xs text-purple-600 mt-1">
                {role === "admin" && "⚠️ Admin has full control over the platform"}
                {role === "instructor" && "👨‍🏫 Instructor can create and manage courses"}
                {role === "student" && "📚 Student can enroll and learn from courses"}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : `Create ${role === "student" ? "Account" : role + " Account"}`}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>

        <Link to="/" className="block text-center mt-4 text-gray-400 hover:text-gray-600">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { icon: BookOpen, label: "Enrolled Courses", value: "4", color: "bg-blue-500" },
    { icon: CheckCircle, label: "Completed", value: "12", color: "bg-green-500" },
    { icon: Clock, label: "Hours Learned", value: "48", color: "bg-purple-500" },
    { icon: Award, label: "Certificates", value: "3", color: "bg-yellow-500" },
  ];

  const courses = [
    { id: 1, title: "Web Development Bootcamp", progress: 75, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400", lastAccessed: "2 hours ago" },
    { id: 2, title: "UI/UX Design Fundamentals", progress: 45, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400", lastAccessed: "1 day ago" },
    { id: 3, title: "Data Science with Python", progress: 30, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400", lastAccessed: "3 days ago" },
  ];

  const recentActivity = [
    { action: "Completed lesson", course: "Web Development Bootcamp", time: "2 hours ago", icon: CheckCircle, color: "text-green-500" },
    { action: "Started new course", course: "UI/UX Design", time: "1 day ago", icon: BookOpen, color: "text-blue-500" },
    { action: "Earned certificate", course: "JavaScript Basics", time: "3 days ago", icon: Award, color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-500 mt-2">Here's what's happening with your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Continue Learning - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
                <Link to="/courses" className="text-blue-600 hover:underline font-medium">View All Courses</Link>
              </div>
              <div className="space-y-4">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                  >
                    <img src={course.image} alt={course.title} className="w-24 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-500">Last accessed {course.lastAccessed}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">{course.progress}%</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Continue
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200" className="w-16 h-16 rounded-lg object-cover" alt="Course" />
                    <div>
                      <h3 className="font-semibold text-gray-900">React Native Advanced</h3>
                      <p className="text-sm text-gray-500">Mobile Development</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200" className="w-16 h-16 rounded-lg object-cover" alt="Course" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Digital Marketing</h3>
                      <p className="text-sm text-gray-500">Marketing</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">4.7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center ${activity.color}`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.course}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Streak */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-orange-100">Day Streak!</p>
                </div>
              </div>
              <p className="text-sm text-orange-100">Keep learning daily to maintain your streak</p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/courses" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Search className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">Browse Courses</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-700">Settings</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoursesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const allCourses = [
    { id: 1, title: "Complete Web Development Bootcamp", instructor: "Dr. Angela Yu", progress: 75, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400", totalLessons: 120, completedLessons: 90, category: "Development", level: "Beginner", rating: 4.9, price: "$89" },
    { id: 2, title: "UI/UX Design Masterclass", instructor: "Gary Simon", progress: 45, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400", totalLessons: 80, completedLessons: 36, category: "Design", level: "Intermediate", rating: 4.8, price: "$79" },
    { id: 3, title: "Data Science & Machine Learning", instructor: "Jose Portilla", progress: 30, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400", totalLessons: 150, completedLessons: 45, category: "Data Science", level: "Advanced", rating: 4.9, price: "$99" },
    { id: 4, title: "React Native Mobile Development", instructor: "Max S.", progress: 0, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400", totalLessons: 95, completedLessons: 0, category: "Development", level: "Intermediate", rating: 4.7, price: "$69" },
    { id: 5, title: "Digital Marketing Strategy", instructor: "Seth Godin", progress: 0, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400", totalLessons: 60, completedLessons: 0, category: "Marketing", level: "Beginner", rating: 4.6, price: "$59" },
    { id: 6, title: "Photography Masterclass", instructor: "Phil Ebiner", progress: 0, image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400", totalLessons: 70, completedLessons: 0, category: "Photography", level: "All Levels", rating: 4.8, price: "$49" },
  ];

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categories = ["all", "Development", "Design", "Data Science", "Marketing", "Photography"];
  const levels = ["all", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
          <p className="text-gray-500 mt-2">Discover new skills and expand your knowledge</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {levels.map(level => (
                <option key={level} value={level}>
                  {level === "all" ? "All Levels" : level}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredCourses.length} of {allCourses.length} courses
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group"
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                    {course.level}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">{course.rating}</span>
                  <span className="text-gray-400 text-sm">({course.totalLessons} lessons)</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">by {course.instructor}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                  {course.progress > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">{course.progress}%</span>
                    </div>
                  ) : (
                    <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                      Enroll Now
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LandingNav() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduNexa
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
            <a href="#courses" className="text-gray-600 hover:text-blue-600 font-medium">Courses</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium">Testimonials</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Pricing</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Sign In</Link>
            <Link to="/register" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition">
              Get Started
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/" className="block text-gray-600 font-medium">Home</Link>
            <a href="#courses" className="block text-gray-600 font-medium">Courses</a>
            <Link to="/login" className="block text-gray-600 font-medium">Sign In</Link>
            <Link to="/register" className="block w-full px-5 py-2.5 bg-blue-600 text-white rounded-full font-medium text-center">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-semibold mb-6">
              <Award className="w-4 h-4 mr-2" />
              #1 E-Learning Platform for 2026
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
              Unlock Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Potential
              </span>{" "}
              With Online Learning
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              Discover expert-led courses in design, development, and business. Learn at your own pace and earn recognized certificates.
            </p>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 flex items-center max-w-md mb-8">
              <Search className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="What do you want to learn?"
                className="flex-1 bg-transparent outline-none px-3 py-2 text-gray-700"
              />
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Search
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                <img src="https://i.pravatar.cc/100?img=3" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                <img src="https://i.pravatar.cc/100?img=4" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">50,000+</p>
                <p className="text-sm text-gray-500">Active learners</p>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative hidden lg:block">
            {/* Main Image Container */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                alt="Students learning"
                className="rounded-[2.5rem] shadow-2xl w-full h-[500px] object-cover"
              />

              {/* Floating Card 1 - Top Left */}
              <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Rating</p>
                    <p className="text-xl font-bold text-gray-900">4.9/5.0</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 - Bottom Right */}
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Courses</p>
                    <p className="text-xl font-bold text-gray-900">2,500+</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 3 - Middle Right */}
              <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Certified</p>
                    <p className="text-sm font-semibold">Get Certificate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { icon: Users, label: "Active Learners", value: "50,000+" },
    { icon: BookOpen, label: "Total Courses", value: "1,200+" },
    { icon: Award, label: "Certificates", value: "25,000+" },
    { icon: Star, label: "Satisfaction", value: "4.9/5" },
  ];

  return (
    <section className="py-12 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-blue-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const categories = [
    { name: "Development", courses: "120 Courses", icon: "💻", color: "bg-blue-100 text-blue-600" },
    { name: "Design", courses: "85 Courses", icon: "🎨", color: "bg-purple-100 text-purple-600" },
    { name: "Business", courses: "95 Courses", icon: "📊", color: "bg-green-100 text-green-600" },
    { name: "Marketing", courses: "70 Courses", icon: "📈", color: "bg-orange-100 text-orange-600" },
    { name: "Photography", courses: "45 Courses", icon: "📷", color: "bg-pink-100 text-pink-600" },
    { name: "Music", courses: "35 Courses", icon: "🎵", color: "bg-indigo-100 text-indigo-600" },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Explore Categories</h2>
          <p className="mt-4 text-xl text-gray-600">Find the perfect course across various categories</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 hover:shadow-xl transition cursor-pointer group">
              <div className={`w-14 h-14 ${cat.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition`}>
                {cat.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{cat.name}</h3>
              <p className="text-gray-500 mt-1">{cat.courses}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCourses() {
  const courses = [
    {
      title: "Complete Web Development Bootcamp",
      instructor: "Dr. Angela Yu",
      rating: 4.9,
      students: "15,420",
      price: "$89",
      oldPrice: "$199",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
      tags: ["Bestseller", "Hot"],
    },
    {
      title: "UI/UX Design Masterclass",
      instructor: "Gary Simon",
      rating: 4.8,
      students: "8,350",
      price: "$79",
      oldPrice: "$149",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
      tags: ["New"],
    },
    {
      title: "Data Science & Machine Learning",
      instructor: "Jose Portilla",
      rating: 4.9,
      students: "22,100",
      price: "$99",
      oldPrice: "$249",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
      tags: ["Bestseller"],
    },
    {
      title: "Digital Marketing Strategy",
      instructor: "Seth Godin",
      rating: 4.7,
      students: "12,800",
      price: "$69",
      oldPrice: "$129",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
      tags: [],
    },
    {
      title: "Python for Data Analysis",
      instructor: " Wes McKinney",
      rating: 4.8,
      students: "18,900",
      price: "$89",
      oldPrice: "$179",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600",
      tags: ["Popular"],
    },
    {
      title: "Mobile App Development",
      instructor: "Maximilian S.",
      rating: 4.8,
      students: "9,600",
      price: "$79",
      oldPrice: "$159",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600",
      tags: ["New"],
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12" id="courses">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">Featured Courses</h2>
            <p className="mt-4 text-xl text-gray-600">Hand-picked courses by our experts</p>
          </div>
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            View All Courses →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition group">
              <div className="relative">
                <img src={course.image} alt={course.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
                {course.tags.map((tag, i) => (
                  <span key={i} className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    tag === "Bestseller" ? "bg-yellow-400 text-yellow-900" :
                    tag === "Hot" ? "bg-red-500 text-white" :
                    tag === "New" ? "bg-green-500 text-white" :
                    "bg-blue-500 text-white"
                  }`}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">{course.rating}</span>
                  <span className="text-gray-500">({course.students} students)</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{course.title}</h3>
                <p className="text-gray-500 text-sm mt-1">by {course.instructor}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                    <span className="text-gray-400 line-through">{course.oldPrice}</span>
                  </div>
                  <Link to="/register" className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-medium hover:bg-blue-200 transition">
                    Enroll Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Frontend Developer",
      content: "EduNexa transformed my career. The courses are practical and up-to-date with industry standards.",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "Michael Chen",
      role: "Product Designer",
      content: "The best learning platform I've used. The mentors are incredibly supportive and knowledgeable.",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
      name: "Emily Davis",
      role: "Data Scientist",
      content: "I landed my dream job after completing the Data Science track. Highly recommended!",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900" id="testimonials">What Students Say</h2>
          <p className="mt-4 text-xl text-gray-600">Success stories from our community</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">"{item.content}"</p>
              <div className="flex items-center space-x-4">
                <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning on EduNexa. Get unlimited access to all courses.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition inline-flex items-center">
              Get Started Free
            </Link>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition">
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">EduNexa</span>
            </div>
            <p className="text-gray-400">
              Empowering learners worldwide with quality education and expert mentorship.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Sitemap</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>support@edunexa.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Learning St, NY 10001</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2026 EduNexa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ========== COURSE DETAIL PAGE ==========
function CourseDetailPage() {
  const { id } = useParams ? useParams() : { id: 1 };
  const { user } = useAuth();
  const [course, setCourse] = useState({
    title: "Complete Web Development Bootcamp",
    description: "Master HTML, CSS, JavaScript, React, Node.js and more in this comprehensive bootcamp.",
    instructor: "Dr. Angela Yu",
    rating: 4.9,
    students: 15420,
    lessons: 120,
    duration: "42 hours",
    level: "Beginner to Advanced",
    price: "$89",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    curriculum: [
      { title: "Introduction to Web Development", duration: "2h 30m", lessons: 8 },
      { title: "HTML5 & CSS3 Fundamentals", duration: "5h 45m", lessons: 15 },
      { title: "JavaScript Basics", duration: "8h 20m", lessons: 22 },
      { title: "React Framework", duration: "12h 15m", lessons: 28 },
      { title: "Node.js & Express", duration: "10h 30m", lessons: 25 },
      { title: "Database & Deployment", duration: "3h 40m", lessons: 22 },
    ]
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/courses" className="hover:text-blue-600">Courses</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{course.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <img src={course.image} alt={course.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{course.level}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Bestseller</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-gray-600 mb-6">{course.description}</p>

                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">{course.rating}</span>
                    <span>({course.students.toLocaleString()} students)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <img src="https://i.pravatar.cc/150?img=32" alt={course.instructor} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-900">{course.instructor}</p>
                    <p className="text-sm text-gray-500">Senior Developer at Google</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
              <div className="space-y-3">
                {course.curriculum.map((section, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{section.title}</p>
                        <p className="text-sm text-gray-500">{section.lessons} lessons • {section.duration}</p>
                      </div>
                    </div>
                    <Play className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <p className="text-3xl font-bold text-gray-900 mb-2">{course.price}</p>
              <p className="text-gray-500 mb-6">One-time payment • Lifetime access</p>

              <Link
                to={`/enroll/${id}`}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-center block hover:opacity-90 transition mb-4"
              >
                Enroll Now
              </Link>

              <button className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition mb-6">
                Add to Wishlist
              </button>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Mobile and TV access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== ENROLLMENT PAGE ==========
function EnrollmentPage() {
  const { courseId } = useParams ? useParams() : { courseId: 1 };
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Enrollment Successful!</h1>
          <p className="text-gray-600 mb-6">You have successfully enrolled in the course. Start learning now!</p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {s < step ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-20 h-1 mx-2 ${s < step ? "bg-blue-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Summary</h2>
              <div className="flex gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200"
                  alt="Course"
                  className="w-32 h-24 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">Complete Web Development Bootcamp</h3>
                  <p className="text-gray-500">Dr. Angela Yu</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">$89</p>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Details</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 border rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input type="text" placeholder="123" className="w-full px-4 py-3 border rounded-xl" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold"
                >
                  Pay $89
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Enrollment</h2>
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Course Price</span>
                  <span className="font-semibold">$89</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">$0</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl">$89</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleEnroll}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Complete Enrollment"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== DASHBOARD NAV COMPONENT ==========
function DashboardNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduNexa
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
            <Link to="/courses" className="text-gray-600 hover:text-blue-600 font-medium">My Courses</Link>
            {user?.role === "admin" && (
              <Link to="/admin" className="text-purple-600 hover:text-purple-700 font-medium">Admin</Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-600">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
