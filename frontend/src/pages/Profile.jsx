import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Award, BookOpen, Clock } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end -mt-16 mb-6">
              <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center text-5xl font-bold text-blue-600 border-4 border-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-6 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h2>
                <p className="text-gray-500">{user?.email || 'user@example.com'}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {user?.role || 'Student'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <User className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-semibold text-gray-900">{user?.role || 'Student'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <Calendar className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-sm text-gray-500">Joined</p>
                <p className="font-semibold text-gray-900">January 2024</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <Award className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-sm text-gray-500">Certificates</p>
                <p className="font-semibold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">9 courses completed</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Learning Hours</p>
                <p className="text-2xl font-bold text-gray-900">48h</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">This month</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h3>
          <div className="space-y-4">
            {[
              { title: 'Completed Machine Learning Basics', date: '2 days ago', icon: Award },
              { title: '7-Day Learning Streak', date: '1 week ago', icon: '🔥' },
              { title: 'Top 10% in Python Course', date: '2 weeks ago', icon: '🏆' },
            ].map((achievement, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                  {typeof achievement.icon === 'string' ? achievement.icon : <achievement.icon className="w-6 h-6 text-yellow-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{achievement.title}</p>
                  <p className="text-sm text-gray-500">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
