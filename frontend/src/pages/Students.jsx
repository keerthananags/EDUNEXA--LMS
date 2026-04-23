import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Users, Search, BookOpen, Award, ArrowLeft } from "lucide-react";

export default function Students() {
  const { user } = useAuth();

  // Mock student data - in production this would come from an API
  const students = [
    { id: 1, name: "John Smith", email: "john@example.com", enrolledCourses: 4, completed: 12, avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Jane Doe", email: "jane@example.com", enrolledCourses: 3, completed: 8, avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", enrolledCourses: 5, completed: 15, avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", enrolledCourses: 2, completed: 5, avatar: "https://i.pravatar.cc/150?img=9" },
    { id: 5, name: "David Brown", email: "david@example.com", enrolledCourses: 6, completed: 20, avatar: "https://i.pravatar.cc/150?img=12" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060e20] transition-colors duration-200">
      {/* Simple Navbar */}
      <header className="bg-white dark:bg-[#091328] border-b border-gray-200 dark:border-white/5 sticky top-0 z-50">
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
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">View and manage enrolled students</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-[#091328] rounded-2xl p-6 shadow-sm mb-8 border border-gray-200 dark:border-white/5 transition-colors duration-200">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-[#1a2544] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student.id} className="bg-white dark:bg-[#091328] rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-white/5 transition-colors duration-200">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Courses</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{student.enrolledCourses}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  </div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{student.completed}</p>
                </div>
              </div>

              <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
