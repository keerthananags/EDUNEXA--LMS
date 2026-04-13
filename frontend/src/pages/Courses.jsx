import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Play, 
  CheckCircle, 
  Search, 
  Filter, 
  ChevronDown,
  Heart,
  MoreHorizontal,
  TrendingUp,
  Award,
  Zap,
  BarChart3,
  Loader2
} from 'lucide-react';

export default function Courses() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [savedCourses, setSavedCourses] = useState([]);
  
  // Real-time data states
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [error, setError] = useState('');

  const categories = ['All', 'Development', 'Design', 'Business', 'Marketing', 'Data Science', 'AI & ML'];

  // Fetch all courses from backend
  useEffect(() => {
    fetchCourses();
    fetchMyEnrollments();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching courses with token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('http://localhost:5000/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Courses response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Courses data received:', data.length, 'courses');
        
        if (!data || data.length === 0) {
          console.log('No courses found in database');
          setAllCourses([]);
          return;
        }
        
        // Transform backend data to match frontend structure
        const transformedCourses = data.map(course => ({
          id: course._id,
          title: course.title,
          instructor: course.instructor?.name || 'Unknown Instructor',
          students: course.enrolledStudents?.length || 0,
          duration: '8h 30m',
          rating: 4.5 + Math.random() * 0.5,
          enrolled: false,
          category: course.category || 'Development',
          level: course.level?.charAt(0).toUpperCase() + course.level?.slice(1) || 'Beginner',
          price: course.price || 0,
          originalPrice: (course.price || 0) * 2,
          image: course.thumbnail || `https://images.unsplash.com/photo-${[
            '1558494949-ef526b0042a0',
            '1555949963-aa79dcee981c',
            '1633356122544-f134324a6cee',
            '1526379095098-d400fd0bf935',
            '1507721999472-8ed4421c4af2',
            '1627398242454-45a1465c2479'
          ][Math.floor(Math.random() * 6)]}?w=400`,
          bestseller: (course.enrolledStudents?.length || 0) > 100,
          description: course.description
        }));
        
        console.log('Transformed courses:', transformedCourses.length);
        setAllCourses(transformedCourses);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch courses:', response.status, errorData);
        setError(`Failed to load courses: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please check your connection.');
    }
  };

  const fetchMyEnrollments = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching my enrollments...');
      
      const response = await fetch('http://localhost:5000/api/my-courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('My courses response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('My enrollments received:', data.length, 'enrollments');
        // Get enrolled course IDs
        const enrolledCourseIds = new Set(data.map(e => e.course?._id?.toString()).filter(Boolean));
        
        // Transform enrollment data
        const transformedEnrollments = data.map(enrollment => ({
          id: enrollment.course?._id || enrollment._id,
          title: enrollment.course?.title || 'Course',
          instructor: enrollment.course?.instructor?.name || 'Unknown',
          progress: enrollment.progress || 0,
          totalLessons: 20, // Placeholder
          completedLessons: Math.floor((enrollment.progress || 0) / 100 * 20),
          duration: '8h 30m',
          rating: 4.7,
          category: enrollment.course?.category || 'Development',
          level: enrollment.course?.level?.charAt(0).toUpperCase() + enrollment.course?.level?.slice(1) || 'Beginner',
          image: enrollment.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
          lastAccessed: 'Recently',
          status: enrollment.status
        }));
        setMyCourses(transformedEnrollments);
        
        // Update allCourses to mark enrolled courses
        setAllCourses(prev => prev.map(course => ({
          ...course,
          enrolled: enrolledCourseIds.has(course.id?.toString())
        })));
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if a course is already enrolled
  const isEnrolled = (courseId) => {
    return myCourses.some(course => course.id === courseId);
  };

  const handleResume = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleEnroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      const token = localStorage.getItem('token');
      console.log('Enrolling in course:', courseId);
      console.log('Token present:', token ? 'Yes' : 'No');
      
      const response = await fetch(`http://localhost:5000/api/enroll/${courseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('Enrollment response:', response.status, data);
      
      if (response.ok) {
        // Update local state to show enrolled
        setAllCourses(prev => prev.map(course => 
          course.id === courseId ? { ...course, enrolled: true } : course
        ));
        // Refresh my courses
        await fetchMyEnrollments();
        // Switch to my courses tab
        setActiveTab('my-courses');
        alert('Successfully enrolled in course!');
      } else {
        alert(data.message || `Failed to enroll (Status: ${response.status})`);
      }
    } catch (err) {
      console.error('Error enrolling:', err);
      alert('Failed to enroll. Please check your connection and try again.');
    } finally {
      setEnrolling(null);
    }
  };

  const toggleSaveCourse = (courseId) => {
    if (savedCourses.includes(courseId)) {
      setSavedCourses(savedCourses.filter(id => id !== courseId));
    } else {
      setSavedCourses([...savedCourses, courseId]);
    }
  };

  const filteredMyCourses = myCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'All' || course.category === selectedCategory)
  );

  const filteredAllCourses = allCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'All' || course.category === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
              <p className="text-gray-500 mt-1">Discover your next learning adventure</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">12 Certificates</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">2,450 XP</span>
              </div>
            </div>
          </div>

          {/* Tabs & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('my-courses')}
                className={`px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 ${
                  activeTab === 'my-courses'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                My Courses
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{myCourses.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('all-courses')}
                className={`px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 ${
                  activeTab === 'all-courses'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                All Courses
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{allCourses.length}</span>
              </button>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => { fetchCourses(); fetchMyEnrollments(); }}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && activeTab === 'my-courses' && (
          <>
            {myCourses.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">You haven't enrolled in any courses yet</h3>
                <p className="text-gray-500 mb-6">Explore our catalog and start learning today!</p>
                <button
                  onClick={() => setActiveTab('all-courses')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                >
                  Browse All Courses
                </button>
              </div>
            ) : filteredMyCourses.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching courses</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMyCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                    <div className="relative">
                      <img src={course.image} alt={course.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                          {course.category}
                        </span>
                        <span className="px-3 py-1 bg-white/90 text-gray-700 text-xs font-bold rounded-full">
                          {course.level}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSaveCourse(course.id); }}
                          className="p-2 bg-white/90 rounded-full hover:bg-white transition"
                        >
                          <Heart className={`w-4 h-4 ${savedCourses.includes(course.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <p className="text-white text-sm">Last accessed {course.lastAccessed}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">{course.instructor}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span className="font-medium">{course.completedLessons}/{course.totalLessons} lessons</span>
                          <span className="font-bold text-blue-600">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{course.rating}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleResume(course.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/20"
                      >
                        <Play className="w-5 h-5" />
                        {course.progress === 100 ? 'Review Course' : 'Resume Learning'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && activeTab === 'all-courses' && (
          <>
            {/* Featured Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Featured Courses
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {allCourses.slice(0, 2).map((course) => (
                  <div 
                    key={course.id} 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <div className="flex">
                      <div className="w-48 relative overflow-hidden">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        {course.bestseller && (
                          <div className="absolute top-2 left-2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Bestseller
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">{course.category}</span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">{course.level}</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{course.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                            <span className="text-sm text-gray-400 line-through">${course.originalPrice}</span>
                          </div>
                          {isEnrolled(course.id) ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.id}`); }}
                              className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Continue
                            </button>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEnroll(course.id); }}
                              disabled={enrolling === course.id}
                              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {enrolling === course.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Enrolling...
                                </>
                              ) : (
                                'Enroll Now'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Courses Grid */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                All Courses
                <span className="text-sm font-normal text-gray-500">({filteredAllCourses.length} courses)</span>
              </h2>
              {allCourses.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses available</h3>
                  <p className="text-gray-500 mb-2">There are no published courses in the system yet.</p>
                  <p className="text-sm text-gray-400">Courses need to be created and published by an admin or instructor.</p>
                </div>
              ) : filteredAllCourses.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses match your search</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAllCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                      <div className="relative">
                        <img src={course.image} alt={course.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                            {course.category}
                          </span>
                          {course.bestseller && (
                            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Bestseller
                            </span>
                          )}
                        </div>
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSaveCourse(course.id); }}
                            className="p-2 bg-white/90 rounded-full hover:bg-white transition shadow-md"
                          >
                            <Heart className={`w-4 h-4 ${savedCourses.includes(course.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{course.rating}</span>
                            <span className="text-gray-400">({course.level})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">${course.price}</span>
                            <span className="text-sm text-gray-400 line-through">${course.originalPrice}</span>
                          </div>
                        </div>

                        {isEnrolled(course.id) ? (
                          <button
                            onClick={() => navigate(`/courses/${course.id}`)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/20"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Continue Learning
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course.id)}
                            disabled={enrolling === course.id}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {enrolling === course.id ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Enrolling...
                              </>
                            ) : (
                              'Enroll Now'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
