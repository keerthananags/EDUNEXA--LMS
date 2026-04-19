import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  Lock, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Award,
  Calendar,
  Globe,
  MessageCircle,
  Heart,
  Share2,
  ArrowLeft,
  Download,
  FileText,
  Video,
  HelpCircle,
  Loader2,
  ThumbsUp
} from 'lucide-react';
import Sidebar from "../components/Sidebar";
import AIChat from "../components/AIChat";
import { enrollmentAPI } from '../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const courseDataFallback = {
  1: {
    id: 1,
    title: "Backend Architecture",
    subtitle: "Master the Art of Scalable Systems",
    description: "Learn to design, build, and deploy robust backend systems. Covers microservices, databases, caching, message queues, and deployment strategies.",
    instructor: {
      name: "John Doe",
      role: "Senior Backend Engineer at Google",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
      rating: 4.9,
      students: 15420,
      courses: 8
    },
    rating: 4.8,
    totalRatings: 2847,
    students: 12450,
    lastUpdated: "December 2024",
    language: "English",
    duration: "12h 40m",
    lectures: 48,
    level: "Intermediate",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?w=800",
    topics: ["Node.js", "Microservices", "Docker", "Kubernetes", "Redis", "MongoDB", "PostgreSQL"],
    whatYouWillLearn: [
      "Design scalable microservices architecture",
      "Implement efficient caching strategies with Redis",
      "Master containerization with Docker & Kubernetes",
      "Build robust APIs with Node.js and Express",
      "Database design and optimization",
      "Deploy to cloud platforms"
    ],
    curriculum: [
      {
        section: "Section 1: Introduction to Backend Architecture",
        duration: "1h 20m",
        lessons: [
          { title: "Course Overview", duration: "5:30", type: "video", free: true },
          { title: "Setting Up Your Environment", duration: "15:45", type: "video", free: true },
          { title: "Architecture Patterns Overview", duration: "25:00", type: "video" },
          { title: "Monolithic vs Microservices", duration: "34:15", type: "video" }
        ]
      },
      {
        section: "Section 2: Building RESTful APIs",
        duration: "2h 45m",
        lessons: [
          { title: "REST Principles", duration: "20:00", type: "video" },
          { title: "Express.js Fundamentals", duration: "35:00", type: "video" },
          { title: "Authentication & Authorization", duration: "45:00", type: "video" },
          { title: "API Security Best Practices", duration: "35:00", type: "video" },
          { title: "Rate Limiting & Throttling", duration: "30:00", type: "video" }
        ]
      },
      {
        section: "Section 3: Database Design",
        duration: "3h 15m",
        lessons: [
          { title: "SQL vs NoSQL", duration: "25:00", type: "video" },
          { title: "PostgreSQL Deep Dive", duration: "50:00", type: "video" },
          { title: "MongoDB for Modern Apps", duration: "45:00", type: "video" },
          { title: "Database Indexing & Optimization", duration: "40:00", type: "video" },
          { title: "Transactions & ACID", duration: "35:00", type: "video" }
        ]
      },
      {
        section: "Section 4: Caching & Performance",
        duration: "2h 10m",
        lessons: [
          { title: "Caching Strategies", duration: "30:00", type: "video" },
          { title: "Redis Implementation", duration: "40:00", type: "video" },
          { title: "CDN & Edge Caching", duration: "25:00", type: "video" },
          { title: "Performance Monitoring", duration: "35:00", type: "video" }
        ]
      }
    ],
    reviews: [
      { name: "Sarah M.", rating: 5, date: "2 weeks ago", comment: "Best backend course I've taken! The microservices section is gold." },
      { name: "David K.", rating: 5, date: "1 month ago", comment: "John explains complex concepts so clearly. Highly recommend!" },
      { name: "Emily R.", rating: 4, date: "2 months ago", comment: "Great content, but would love more hands-on projects." }
    ]
  },
  2: {
    id: 2,
    title: "Machine Learning",
    subtitle: "From Zero to ML Engineer",
    description: "Comprehensive machine learning course covering supervised and unsupervised learning, neural networks, deep learning, and real-world applications.",
    instructor: {
      name: "Jane Smith",
      role: "ML Engineer at OpenAI",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      rating: 4.9,
      students: 22100,
      courses: 5
    },
    rating: 4.9,
    totalRatings: 4532,
    students: 18750,
    lastUpdated: "January 2025",
    language: "English",
    duration: "8h 20m",
    lectures: 42,
    level: "Beginner to Advanced",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    topics: ["Python", "TensorFlow", "PyTorch", "Neural Networks", "Deep Learning", "NLP", "Computer Vision"],
    whatYouWillLearn: [
      "Master Python for data science",
      "Build neural networks from scratch",
      "Implement CNNs and RNNs",
      "Natural Language Processing",
      "Computer Vision applications",
      "Deploy ML models to production"
    ],
    curriculum: [
      {
        section: "Section 1: ML Fundamentals",
        duration: "2h 00m",
        lessons: [
          { title: "Introduction to ML", duration: "10:00", type: "video", free: true },
          { title: "Python for ML", duration: "45:00", type: "video", free: true },
          { title: "NumPy & Pandas", duration: "35:00", type: "video" },
          { title: "Data Preprocessing", duration: "30:00", type: "video" }
        ]
      },
      {
        section: "Section 2: Supervised Learning",
        duration: "2h 30m",
        lessons: [
          { title: "Linear Regression", duration: "40:00", type: "video" },
          { title: "Logistic Regression", duration: "35:00", type: "video" },
          { title: "Decision Trees", duration: "35:00", type: "video" },
          { title: "Random Forests", duration: "40:00", type: "video" }
        ]
      }
    ],
    reviews: [
      { name: "Michael T.", rating: 5, date: "1 week ago", comment: "Jane is an amazing instructor. Best ML course on the platform!" },
      { name: "Lisa P.", rating: 5, date: "3 weeks ago", comment: "Finally understand neural networks thanks to this course." }
    ]
  }
};

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], rating: 0, numReviews: 0, distribution: {} });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  useEffect(() => {
    fetchCourseDetails();
    fetchReviews();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Course not found');
        } else {
          setError('Failed to load course details');
        }
        return;
      }
      
      const data = await response.json();
      setCourse(data);
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`${API_BASE_URL}/courses/${id}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviewsData(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await enrollmentAPI.enroll(id);
      setEnrollSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      alert('Please enter a review comment');
      return;
    }

    try {
      setSubmittingReview(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/courses/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      if (response.ok) {
        setShowReviewForm(false);
        setReviewForm({ rating: 5, comment: '' });
        fetchReviews();
        fetchCourseDetails();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit review');
      }
    } catch (err) {
      alert('Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-[#060e20] text-[#dee5ff] min-h-screen flex items-center justify-center">
        <Sidebar />
        <main className="ml-64 flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#5764f1]" />
        </main>
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="bg-[#060e20] text-[#dee5ff] min-h-screen">
        <Sidebar />
        <main className="ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-slate-400 mb-4">{error || 'Course not found'}</p>
            <button 
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2 text-[#5764f1] hover:underline"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Courses
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? -1 : index);
  };

  return (
    <div className="bg-[#060e20] text-[#dee5ff] min-h-screen">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[400px]">
          <img 
            src={course.image} 
            alt={course.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-[#060e20]/80 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-6xl mx-auto">
              <button 
                onClick={() => navigate('/courses')}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Courses
              </button>
              
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-[#5764f1]/20 text-[#5764f1] text-xs font-bold rounded-full">
                      {course.level}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                      Bestseller
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                  <p className="text-xl text-slate-400 mb-4">{course.subtitle}</p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 font-bold">{course.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                        ))}
                      </div>
                      <span className="text-slate-400">({course.totalRatings.toLocaleString()} ratings)</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Users className="w-4 h-4" />
                      {course.students.toLocaleString()} students
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-4 h-4" />
                      Last updated {course.lastUpdated}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-3 rounded-xl border border-white/10 transition ${isSaved ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/5'}`}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-xl border border-white/10 hover:bg-white/5 transition">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-1 mb-6 bg-[#091328] p-1 rounded-xl">
                {['overview', 'curriculum', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium capitalize transition ${
                      activeTab === tab 
                        ? 'bg-[#5764f1] text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Description */}
                  <div className="bg-[#091328] rounded-2xl p-6 border border-white/5">
                    <h2 className="text-xl font-bold mb-4">Description</h2>
                    <p className="text-slate-400 leading-relaxed">{course.description}</p>
                  </div>

                  {/* What You'll Learn */}
                  <div className="bg-[#091328] rounded-2xl p-6 border border-white/5">
                    <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="bg-[#091328] rounded-2xl p-6 border border-white/5">
                    <h2 className="text-xl font-bold mb-4">Topics covered</h2>
                    <div className="flex flex-wrap gap-2">
                      {course.topics.map((topic) => (
                        <span 
                          key={topic}
                          className="px-4 py-2 bg-[#192540] rounded-lg text-sm text-slate-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="bg-[#091328] rounded-2xl border border-white/5 overflow-hidden">
                  <div className="p-6 border-b border-white/5">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold">Course Content</h2>
                      <div className="text-sm text-slate-400">
                        {course.curriculum.length} sections • {course.lectures} lectures • {course.duration} total
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-white/5">
                    {course.curriculum.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        <button
                          onClick={() => toggleSection(sectionIndex)}
                          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition"
                        >
                          <div className="flex items-center gap-3">
                            {expandedSection === sectionIndex ? 
                              <ChevronUp className="w-5 h-5 text-slate-400" /> : 
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            }
                            <span className="font-medium text-left">{section.section}</span>
                          </div>
                          <span className="text-sm text-slate-500">{section.duration}</span>
                        </button>
                        
                        {expandedSection === sectionIndex && (
                          <div className="bg-[#0f1930]">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div 
                                key={lessonIndex}
                                className="flex items-center justify-between p-4 pl-12 hover:bg-white/5 transition cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.type === 'video' ? 
                                    <Play className="w-4 h-4 text-slate-400" /> : 
                                    <FileText className="w-4 h-4 text-slate-400" />
                                  }
                                  <span className={`text-sm ${lesson.free ? 'text-[#5764f1]' : 'text-slate-300'}`}>
                                    {lesson.title}
                                  </span>
                                  {lesson.free && (
                                    <span className="text-xs text-[#5764f1] bg-[#5764f1]/10 px-2 py-0.5 rounded">Preview</span>
                                  )}
                                </div>
                                <span className="text-sm text-slate-500">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="bg-[#091328] rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-8 mb-6">
                      <div className="text-center">
                        <p className="text-5xl font-bold text-yellow-400">{(reviewsData.rating || 0).toFixed(1)}</p>
                        <div className="flex justify-center my-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(reviewsData.rating || 0) ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                          ))}
                        </div>
                        <p className="text-sm text-slate-400">{reviewsData.numReviews || 0} Reviews</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="text-sm text-slate-400 w-8">{stars} star</span>
                            <div className="flex-1 h-2 bg-[#192540] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                style={{ width: `${reviewsData.distribution?.[stars] || 0}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-400 w-12 text-right">
                              {reviewsData.distribution?.[stars] || 0}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add Review Button */}
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="w-full py-3 bg-[#192540] text-white rounded-xl font-medium hover:bg-[#253550] transition flex items-center justify-center gap-2"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                    </button>

                    {/* Review Form */}
                    {showReviewForm && (
                      <form onSubmit={handleSubmitReview} className="mt-4 p-4 bg-[#0f1930] rounded-xl space-y-4">
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Your Rating</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                className="focus:outline-none"
                              >
                                <Star className={`w-6 h-6 ${star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Your Review</label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            placeholder="Share your experience with this course..."
                            className="w-full px-4 py-3 bg-[#192540] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#5764f1]"
                            rows={4}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="w-full py-3 bg-gradient-to-r from-[#5764f1] to-[#c081ff] text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50"
                        >
                          {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Reviews List */}
                  {reviewsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-[#5764f1]" />
                    </div>
                  ) : (
                    (reviewsData.reviews || []).map((review, index) => (
                      <div key={index} className="bg-[#091328] rounded-2xl p-6 border border-white/5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5764f1] to-[#c081ff] flex items-center justify-center text-white font-bold">
                              {review.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-bold">{review.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                                  ))}
                                </div>
                                <span className="text-sm text-slate-400">
                                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-300">{review.comment}</p>
                      </div>
                    ))
                  )}

                  {!reviewsLoading && (reviewsData.reviews || []).length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <p>No reviews yet. Be the first to review this course!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Enroll Card */}
                <div className="bg-[#091328] rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={course.instructor.image} 
                      alt={course.instructor.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold">{course.instructor.name}</p>
                      <p className="text-sm text-slate-400">{course.instructor.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{course.instructor.rating}</span>
                        <span className="text-sm text-slate-400">• {course.instructor.students.toLocaleString()} students</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleEnroll}
                    disabled={enrolling || enrollSuccess}
                    className="w-full py-4 bg-gradient-to-r from-[#5764f1] to-[#c081ff] text-white rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(87,100,241,0.5)] transition mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enrolling...
                      </span>
                    ) : enrollSuccess ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Enrolled! Redirecting...
                      </span>
                    ) : (
                      `Enroll Now - $${course.price}`
                    )}
                  </button>
                  
                  <button className="w-full py-3 border border-white/20 text-white rounded-xl font-medium hover:bg-white/5 transition">
                    Start Free Preview
                  </button>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Play className="w-4 h-4" />
                      {course.duration} on-demand video
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <FileText className="w-4 h-4" />
                      {course.lectures} lectures
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Download className="w-4 h-4" />
                      Downloadable resources
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Globe className="w-4 h-4" />
                      {course.language}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Award className="w-4 h-4" />
                      Certificate of completion
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      Full lifetime access
                    </div>
                  </div>
                </div>

                {/* This Course Includes */}
                <div className="bg-[#091328] rounded-2xl p-6 border border-white/5">
                  <h3 className="font-bold mb-4">This course includes:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Video className="w-4 h-4 text-[#5764f1]" />
                      <span>{course.duration || 'N/A'} of HD video content</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <BookOpen className="w-4 h-4 text-[#5764f1]" />
                      <span>{course.lectures || course.lessons?.length || 0} comprehensive lectures</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Download className="w-4 h-4 text-[#5764f1]" />
                      <span>{course.resources?.length || 'Multiple'} downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-[#5764f1]" />
                      <span>Available in {course.language || 'English'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <HelpCircle className="w-4 h-4 text-[#5764f1]" />
                      <span>24/7 Q&A Support</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Award className="w-4 h-4 text-[#5764f1]" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-[#5764f1]" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#5764f1]" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                  
                  {/* Additional Course Features */}
                  {(course.whatYouWillLearn?.length > 0 || course.topics?.length > 0) && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-slate-400 mb-2">Key Topics:</p>
                      <div className="flex flex-wrap gap-1">
                        {(course.topics || course.whatYouWillLearn || []).slice(0, 5).map((topic, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-[#192540] rounded text-slate-300">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <AIChat 
        courseTitle={course.title} 
        courseContent={`${course.description || ''}. Topics: ${course.topics?.join(', ') || course.tags?.join(', ') || 'Various topics'}. Learning outcomes: ${course.whatYouWillLearn?.join(', ') || course.learningOutcomes?.join(', ') || 'Course fundamentals'}`} 
      />
    </div>
  );
}

