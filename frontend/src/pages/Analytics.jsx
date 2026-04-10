import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, ArrowLeft, TrendingUp, Users, Award, Clock } from "lucide-react";

export default function Analytics() {
  const { user } = useAuth();

  // Mock analytics data
  const stats = [
    { title: "Learning Hours", value: "48", change: "+12%", icon: Clock, color: "from-blue-500 to-blue-600" },
    { title: "Courses Completed", value: "12", change: "+3", icon: Award, color: "from-green-500 to-green-600" },
    { title: "Active Courses", value: "4", change: "+1", icon: BookOpen, color: "from-purple-500 to-purple-600" },
    { title: "Avg. Score", value: "85%", change: "+5%", icon: TrendingUp, color: "from-orange-500 to-orange-600" },
  ];

  const weeklyProgress = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.8 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 4.2 },
    { day: "Fri", hours: 3.0 },
    { day: "Sat", hours: 5.5 },
    { day: "Sun", hours: 2.0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navbar */}
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
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium"
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
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-2">Track your learning progress and performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-green-600 text-sm font-semibold mt-2">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Weekly Learning Activity</h3>
          <div className="flex items-end justify-between h-48 gap-4">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all"
                  style={{ height: `${(day.hours / 6) * 100}%` }}
                ></div>
                <p className="text-sm text-gray-500 mt-2">{day.day}</p>
                <p className="text-xs text-gray-400">{day.hours}h</p>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Achievements */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-4">
              {[
                { title: "Course Master", desc: "Completed 3 courses with 90%+ score", date: "2 days ago", icon: Award },
                { title: "Consistent Learner", desc: "7-day learning streak", date: "1 week ago", icon: TrendingUp },
                { title: "Quiz Champion", desc: "Scored 100% on 5 consecutive quizzes", date: "2 weeks ago", icon: Award },
              ].map((achievement, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <achievement.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-500">{achievement.desc}</p>
                    <p className="text-xs text-gray-400 mt-1">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Skills */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Top Skills</h3>
            <div className="space-y-4">
              {[
                { name: "Web Development", progress: 85 },
                { name: "UI/UX Design", progress: 70 },
                { name: "Data Analysis", progress: 60 },
                { name: "Project Management", progress: 75 },
              ].map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">{skill.name}</span>
                    <span className="text-sm text-gray-500">{skill.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
