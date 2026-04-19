import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Users, 
  BookOpen as CoursesIcon, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Filter, 
  X, 
  User as UserIcon,
  Shield,
  Award,
  Zap,
  Activity,
  BarChart3,
  ChevronRight,
  MoreHorizontal,
  Bell,
  UserPlus
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showAssignCourseModal, setShowAssignCourseModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'student' });
  const [newCourse, setNewCourse] = useState({ title: '', description: '', category: 'Development', level: 'beginner', price: 0 });
  const [assignCourse, setAssignCourse] = useState({ userId: '', courseId: '' });

  useEffect(() => {
    fetchAdminData();
    fetchEnrollments();
  }, []);

  const handleUnauthorized = () => {
    alert('Session expired. Please login again.');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        handleUnauthorized();
        return;
      }
    
      // Fetch stats
      const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (statsRes.status === 401) {
        handleUnauthorized();
        return;
      }
      
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch users
      const usersRes = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (usersRes.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!usersRes.ok) throw new Error("Failed to fetch users");

      const usersData = await usersRes.json();
      setUsers(usersData);

      // Fetch courses
      const coursesRes = await fetch(`${API_BASE_URL}/admin/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (coursesRes.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!coursesRes.ok) throw new Error("Failed to fetch courses");

      const coursesData = await coursesRes.json();
      setCourses(coursesData);

    } catch (error) {
      console.error("❌ Failed to fetch admin data:", error);
    }
  };

  // Fetch Enrollments
  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/enrollments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch enrollments");
      }

      const data = await res.json();
      setEnrollments(data);

    } catch (error) {
      console.error("❌ Failed to fetch enrollments:", error);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    window.location.href = "/admin/login";
  };

  // Delete Enrollment
  const handleDeleteEnrollment = async (enrollmentId) => {
    if (!window.confirm("Are you sure you want to remove this enrollment?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/enrollments/${enrollmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to delete enrollment");
      }

      setEnrollments(enrollments.filter(e => e._id !== enrollmentId));
      fetchAdminData(); // refresh stats

    } catch (error) {
      console.error("❌ Failed to delete enrollment:", error);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter(u => u._id !== userId));

    } catch (error) {
      console.error("❌ Failed to delete user:", error);
    }
  };

  // Update User Role
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) throw new Error("Failed to update role");

      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("❌ Update role error:", error);
    }
  };

  // Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (res.status === 401) return handleUnauthorized();

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUsers([...users, data]);
      setShowAddUserModal(false);
      setNewUser({ name: "", email: "", password: "", role: "student" });

    } catch (error) {
      console.error("❌ Add user error:", error);
    }
  };

  // Add Course
  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse),
      });

      if (res.status === 401) return handleUnauthorized();

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setCourses([...courses, data]);
      setShowAddCourseModal(false);
      setNewCourse({
        title: "",
        description: "",
        category: "Development",
        level: "beginner",
        price: 0,
      });

      alert("✅ Course created");

    } catch (error) {
      console.error("❌ Add course error:", error);
      alert(error.message);
    }
  };

  // Assign Course
  const handleAssignCourse = async (e) => {
    e.preventDefault();

    if (!assignCourse.userId || !assignCourse.courseId) {
      return alert("Select user & course");
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/enrollments/admin-assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(assignCourse),
      });

      if (res.status === 401) return handleUnauthorized();

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setShowAssignCourseModal(false);
      setAssignCourse({ userId: "", courseId: "" });

      alert(`✅ Assigned to ${data.enrollment?.student?.name || "user"}`);
      fetchAdminData();

    } catch (error) {
      console.error("❌ Assign error:", error);
      alert(error.message);
    }
  };

  // Toggle Publish Course
  const handleTogglePublishCourse = async (courseId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (res.status === 401) return handleUnauthorized();

      const updatedCourse = await res.json();
      if (!res.ok) throw new Error("Update failed");

      setCourses(courses.map(c => c._id === courseId ? updatedCourse : c));
      alert(`✅ ${!currentStatus ? "Published" : "Unpublished"}`);

    } catch (error) {
      console.error("❌ Publish error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-slate-400 mt-1">Welcome back, {user?.name || 'Admin'}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 bg-[#091328] rounded-xl border border-white/5 hover:bg-[#0f1930] transition relative">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 px-4 py-2 bg-[#091328] rounded-xl border border-white/5">
                <div className="w-10 h-10 bg-gradient-to-br from-[#5764f1] to-[#c081ff] rounded-lg flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
              </div>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#091328] rounded-2xl p-6 border border-white/5 hover:border-[#5764f1]/30 transition group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +12%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stats.stats?.totalUsers || '0'}</p>
                  <p className="text-sm text-slate-400">Total Users</p>
                  <div className="mt-4 h-1 bg-[#192540] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-[75%] rounded-full" />
                  </div>
                </div>
                
                <div 
                  onClick={() => setActiveTab('courses')}
                  className="bg-[#091328] rounded-2xl p-6 border border-white/5 hover:border-[#5764f1]/30 transition group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                      <CoursesIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +5%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stats.stats?.totalCourses || '0'}</p>
                  <p className="text-sm text-slate-400">Total Courses</p>
                  <div className="mt-4 h-1 bg-[#192540] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 w-[60%] rounded-full" />
                  </div>
                </div>
                
                <div 
                  onClick={() => setActiveTab('enrollments')}
                  className="bg-[#091328] rounded-2xl p-6 border border-white/5 hover:border-[#5764f1]/30 transition group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-400" />
                    </div>
                    <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +18%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stats.stats?.totalEnrollments || '0'}</p>
                  <p className="text-sm text-slate-400">Enrollments</p>
                  <div className="mt-4 h-1 bg-[#192540] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 w-[85%] rounded-full" />
                  </div>
                </div>
                
                <div className="bg-[#091328] rounded-2xl p-6 border border-white/5 hover:border-[#5764f1]/30 transition group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-orange-400" />
                    </div>
                    <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +8%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stats.stats?.publishedCourses || '0'}</p>
                  <p className="text-sm text-slate-400">Published</p>
                  <div className="mt-4 h-1 bg-[#192540] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-yellow-500 w-[92%] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#091328] rounded-2xl p-6 border border-white/5 mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setShowAddCourseModal(true)}
                    className="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-[#5764f1]/20 to-[#5764f1]/10 rounded-xl text-[#9fa7ff] font-medium hover:from-[#5764f1]/30 hover:to-[#5764f1]/20 transition border border-[#5764f1]/20 hover:border-[#5764f1]/40 group"
                  >
                    <div className="w-10 h-10 bg-[#5764f1]/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span>Add New Course</span>
                  </button>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded-xl text-green-400 font-medium hover:from-green-500/30 hover:to-green-500/20 transition border border-green-500/20 hover:border-green-500/40 group"
                  >
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span>Add New User</span>
                  </button>
                  <button
                    onClick={() => setShowAssignCourseModal(true)}
                    className="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-orange-500/20 to-orange-500/10 rounded-xl text-orange-400 font-medium hover:from-orange-500/30 hover:to-orange-500/20 transition border border-orange-500/20 hover:border-orange-500/40 group"
                  >
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <span>Assign Course</span>
                  </button>
                  <button
                    onClick={() => setShowReportsModal(true)}
                    className="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-purple-500/20 to-purple-500/10 rounded-xl text-purple-400 font-medium hover:from-purple-500/30 hover:to-purple-500/20 transition border border-purple-500/20 hover:border-purple-500/40 group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <span>View Reports</span>
                  </button>
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-[#091328] rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#5764f1]" />
                  Recent Users
                </h2>
                <div className="space-y-3">
                  {stats.recentUsers?.slice(0, 5).map((u) => (
                    <div key={u._id} className="flex items-center justify-between p-4 bg-[#0f1930] rounded-xl border border-white/5 hover:border-[#5764f1]/30 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#5764f1] to-[#c081ff] rounded-lg flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{u.name}</p>
                          <p className="text-sm text-slate-400">{u.email}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                        u.role === 'instructor' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="bg-[#091328] rounded-2xl border border-white/5 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#5764f1]" />
                    User Management
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Manage all users and their roles</p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#5764f1] to-[#c081ff] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition"
                >
                  <Plus className="w-5 h-5" />
                  Add User
                </button>
              </div>

              <div className="relative mb-6">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#5764f1] focus:border-transparent text-white placeholder-slate-400"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="border-b border-white/5 hover:bg-[#0f1930] transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#5764f1] to-[#c081ff] rounded-lg flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{u.email}</td>
                        <td className="py-3 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                            className="px-3 py-1 bg-[#0f1930] border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-[#5764f1]"
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition border border-transparent hover:border-red-500/20"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="bg-[#091328] rounded-2xl border border-white/5 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CoursesIcon className="w-5 h-5 text-[#5764f1]" />
                    Course Management
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Manage all courses and their status</p>
                </div>
                <button 
                  onClick={() => setShowAddCourseModal(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#5764f1] to-[#c081ff] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition"
                >
                  <Plus className="w-5 h-5" />
                  Add Course
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course._id} className="bg-[#0f1930] rounded-xl p-5 border border-white/5 hover:border-[#5764f1]/30 transition group">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-white text-lg">{course.title || 'Course'}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{course.description || 'No description available'}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Users className="w-4 h-4" />
                        {course.enrolledStudents?.length || 0} students
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTogglePublishCourse(course._id, course.isPublished)}
                          className={`p-2 rounded-lg transition border ${course.isPublished ? 'text-yellow-400 hover:bg-yellow-500/10 border-transparent hover:border-yellow-500/30' : 'text-green-400 hover:bg-green-500/10 border-transparent hover:border-green-500/30'}`}
                          title={course.isPublished ? 'Unpublish Course' : 'Publish Course'}
                        >
                          {course.isPublished ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                        <button className="p-2 text-[#5764f1] hover:bg-[#5764f1]/10 rounded-lg transition border border-transparent hover:border-[#5764f1]/30">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition border border-transparent hover:border-red-500/30">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'enrollments' && (
            <div className="bg-[#091328] rounded-2xl border border-white/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#5764f1]" />
                  Manage Enrollments
                </h2>
                <button
                  onClick={() => setShowAssignCourseModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5764f1] to-[#c081ff] text-white rounded-lg text-sm font-medium hover:shadow-lg transition"
                >
                  <UserPlus className="w-4 h-4" />
                  Assign Course
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Student</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Course</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Progress</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Enrolled Date</th>
                      <th className="text-center py-3 px-4 text-slate-400 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment._id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5764f1] to-[#c081ff] flex items-center justify-center text-white font-bold text-sm">
                              {enrollment.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-white">{enrollment.user?.name}</p>
                              <p className="text-xs text-slate-400">{enrollment.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-white">{enrollment.course?.title}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-[#192540] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#5764f1] to-[#c081ff] rounded-full transition-all"
                                style={{ width: `${enrollment.progress || 0}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-400">{enrollment.progress || 0}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-sm">
                          {enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteEnrollment(enrollment._id)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
                            title="Remove Enrollment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {enrollments.length === 0 && (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No enrollments found</p>
                    <button
                      onClick={() => setShowAssignCourseModal(true)}
                      className="mt-4 text-[#5764f1] hover:underline text-sm"
                    >
                      Assign a course to a student
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-[#091328] rounded-2xl border border-white/5 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#5764f1]" />
                Admin Settings
              </h2>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Site Name</label>
                  <input 
                    type="text" 
                    defaultValue="EduNexa LMS" 
                    className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#5764f1] focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Admin Email</label>
                  <input 
                    type="email" 
                    defaultValue="admin@edunexa.com" 
                    className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#5764f1] focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Platform Description</label>
                  <textarea 
                    rows={3}
                    defaultValue="A modern learning management system for the future of education." 
                    className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#5764f1] focus:border-transparent" 
                  />
                </div>
                <button className="px-8 py-3 bg-gradient-to-r from-[#5764f1] to-[#c081ff] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#091328] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-green-400" />
                </div>
                Add New User
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition border border-transparent hover:border-white/10"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#5764f1] focus:border-transparent text-white placeholder-slate-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#5764f1] focus:border-transparent text-white placeholder-slate-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#5764f1] focus:border-transparent text-white placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#5764f1] focus:border-transparent text-white"
                >
                  <option value="student" className="bg-[#0f1930]">Student</option>
                  <option value="instructor" className="bg-[#0f1930]">Instructor</option>
                  <option value="admin" className="bg-[#0f1930]">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/30 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add User
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#091328] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-10 h-10 bg-[#5764f1]/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-[#5764f1]" />
                </div>
                Add New Course
              </h3>
              <button
                onClick={() => setShowAddCourseModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition border border-transparent hover:border-white/10"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Course Title *</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#5764f1] focus:border-transparent text-white placeholder-slate-500"
                  placeholder="e.g. Advanced React Patterns"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#5764f1] focus:border-transparent text-white placeholder-slate-500"
                  placeholder="Course description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#5764f1] focus:border-transparent text-white"
                  >
                    <option value="Development" className="bg-[#0f1930]">Development</option>
                    <option value="Design" className="bg-[#0f1930]">Design</option>
                    <option value="Business" className="bg-[#0f1930]">Business</option>
                    <option value="Marketing" className="bg-[#0f1930]">Marketing</option>
                    <option value="Data Science" className="bg-[#0f1930]">Data Science</option>
                    <option value="AI & ML" className="bg-[#0f1930]">AI & ML</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Level</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#5764f1] focus:border-transparent text-white"
                  >
                    <option value="beginner" className="bg-[#0f1930]">Beginner</option>
                    <option value="intermediate" className="bg-[#0f1930]">Intermediate</option>
                    <option value="advanced" className="bg-[#0f1930]">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#5764f1] focus:border-transparent text-white placeholder-slate-500"
                  placeholder="49.99"
                />
              </div>
              <p className="text-xs text-slate-400">
                * Course will be created as unpublished. You can publish it from the Courses tab.
              </p>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-[#5764f1] to-[#c081ff] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Course
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#091328] rounded-2xl shadow-2xl w-full max-w-5xl p-6 max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#5764f1] to-[#c081ff] rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                Reports Dashboard
              </h3>
              <button
                onClick={() => setShowReportsModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition border border-transparent hover:border-white/10"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0f1930] rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-sm text-slate-400">Total Users</p>
                </div>
                <p className="text-2xl font-bold text-white">{stats.stats?.totalUsers || '0'}</p>
              </div>
              <div className="bg-[#0f1930] rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CoursesIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-sm text-slate-400">Total Courses</p>
                </div>
                <p className="text-2xl font-bold text-white">{stats.stats?.totalCourses || '0'}</p>
              </div>
              <div className="bg-[#0f1930] rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-sm text-slate-400">Enrollments</p>
                </div>
                <p className="text-2xl font-bold text-white">{stats.stats?.totalEnrollments || '0'}</p>
              </div>
              <div className="bg-[#0f1930] rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-orange-400" />
                  </div>
                  <p className="text-sm text-slate-400">Published</p>
                </div>
                <p className="text-2xl font-bold text-white">{stats.stats?.publishedCourses || '0'}</p>
              </div>
            </div>

            {/* User Details Table */}
            <div className="mb-6 bg-[#0f1930] rounded-xl p-4 border border-white/5">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#5764f1]" />
                User Details
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#091328] border-b border-white/10">
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Courses</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 10).map((user) => (
                      <tr key={user._id} className="border-b border-white/5 hover:bg-[#091328] transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#5764f1] to-[#c081ff] rounded-lg flex items-center justify-center">
                              <UserIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-white">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                            user.role === 'instructor' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{Math.floor(Math.random() * 10) + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-[#192540] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#5764f1] to-[#c081ff]"
                                style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-400">{Math.floor(Math.random() * 100)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Course Completion Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0f1930] rounded-xl p-4 border border-white/5">
                <h4 className="text-lg font-bold text-white mb-4">Course Completion by Role</h4>
                <div className="space-y-4">
                  {[
                    { role: 'Students', completion: 75, color: 'from-blue-500 to-cyan-500' },
                    { role: 'Instructors', completion: 90, color: 'from-green-500 to-emerald-500' },
                    { role: 'Admins', completion: 95, color: 'from-purple-500 to-pink-500' },
                  ].map((item) => (
                    <div key={item.role}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{item.role}</span>
                        <span className="text-slate-400">{item.completion}%</span>
                      </div>
                      <div className="w-full h-3 bg-[#192540] rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${item.color} transition-all rounded-full`}
                          style={{ width: `${item.completion}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0f1930] rounded-xl p-4 border border-white/5">
                <h4 className="text-lg font-bold text-white mb-4">Enrollment Trends</h4>
                <div className="h-48 flex items-end justify-between gap-2">
                  {[
                    { month: 'Jan', value: 45 },
                    { month: 'Feb', value: 65 },
                    { month: 'Mar', value: 55 },
                    { month: 'Apr', value: 85 },
                    { month: 'May', value: 75 },
                    { month: 'Jun', value: 95 },
                  ].map((item) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-gradient-to-t from-[#5764f1] to-[#c081ff] rounded-t-lg transition-all"
                        style={{ height: `${item.value}%` }}
                      />
                      <span className="text-xs text-slate-400">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Performance */}
            <div className="mt-6">
              <h4 className="text-lg font-bold text-white mb-4">Course Performance</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courses.slice(0, 6).map((course) => (
                  <div key={course._id} className="bg-[#0f1930] rounded-xl p-4 border border-white/5">
                    <h5 className="font-medium text-white mb-2">{course.title || 'Course'}</h5>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Students</span>
                      <span className="text-white font-medium">{Math.floor(Math.random() * 100) + 20}</span>
                    </div>
                    <div className="w-full h-2 bg-[#192540] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-[#5764f1]"
                        style={{ width: `${Math.floor(Math.random() * 60) + 40}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{Math.floor(Math.random() * 60) + 40}% completion</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Course Modal */}
      {showAssignCourseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#091328] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-orange-400" />
                </div>
                Assign Course to User
              </h3>
              <button
                onClick={() => setShowAssignCourseModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition border border-transparent hover:border-white/10"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAssignCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select User *</label>
                <select
                  value={assignCourse.userId}
                  onChange={(e) => setAssignCourse({ ...assignCourse, userId: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                >
                  <option value="" className="bg-[#0f1930]">Choose a user...</option>
                  {users.filter(u => u.role === 'student').map(user => (
                    <option key={user._id} value={user._id} className="bg-[#0f1930]">
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Course *</label>
                <select
                  value={assignCourse.courseId}
                  onChange={(e) => setAssignCourse({ ...assignCourse, courseId: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0f1930] border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                >
                  <option value="" className="bg-[#0f1930]">Choose a course...</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id} className="bg-[#0f1930]">
                      {course.title} {course.isPublished ? '(Published)' : '(Unpublished)'}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-400">
                * The user will be enrolled in this course immediately. Free course assignment (no payment required).
              </p>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/30 transition flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Assign Course
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
