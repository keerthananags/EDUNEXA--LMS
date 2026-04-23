import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(() => {
    // Load events from localStorage
    const saved = localStorage.getItem('calendarEvents');
    return saved ? JSON.parse(saved) : {
      5: [{ title: 'Machine Learning Quiz', type: 'exam' }],
      12: [{ title: 'Project Deadline', type: 'deadline' }],
      18: [{ title: 'Live Session: Python', type: 'session' }],
      25: [{ title: 'Course Completion', type: 'milestone' }],
    };
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'session' });

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;
    
    const dayKey = selectedDay.toString();
    setEvents(prev => ({
      ...prev,
      [dayKey]: [...(prev[dayKey] || []), { ...newEvent }]
    }));
    
    setNewEvent({ title: '', type: 'session' });
    setShowModal(false);
  };

  const handleDeleteEvent = (day, index) => {
    const dayKey = day.toString();
    setEvents(prev => ({
      ...prev,
      [dayKey]: (prev[dayKey] || []).filter((_, i) => i !== index)
    }));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060e20] p-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            <Plus className="w-5 h-5" />
            Add Event
          </button>
        </div>

        <div className="bg-white dark:bg-[#091328] rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-white/5 transition-colors duration-200">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/5">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition text-gray-600 dark:text-gray-400">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition text-gray-600 dark:text-gray-400">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            <div className="grid grid-cols-7 gap-4 mb-4">
              {days.map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 text-sm">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: startingDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-24"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = events[day] || [];
                const hasEvents = dayEvents.length > 0;
                return (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`h-24 p-2 border rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition overflow-y-auto ${
                      hasEvents ? 'border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-white/5'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{day}</span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event, idx) => (
                        <div key={idx} className={`text-[10px] px-1 py-0.5 rounded truncate ${
                          event.type === 'exam' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                          event.type === 'deadline' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                          event.type === 'session' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        }`}>
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[10px] text-gray-500">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(events).flatMap(([day, dayEvents]) => 
              dayEvents.map((event, idx) => (
                <div key={`${day}-${idx}`} className="bg-white dark:bg-[#091328] p-4 rounded-xl shadow-sm border-l-4 border-blue-600 dark:border-blue-500 flex justify-between items-start border border-gray-100 dark:border-white/5 transition-colors duration-200">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{months[currentDate.getMonth()]} {day}, {currentDate.getFullYear()}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                      event.type === 'exam' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                      event.type === 'deadline' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                      event.type === 'session' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteEvent(parseInt(day), idx)}
                    className="p-1 hover:bg-red-100 rounded text-red-500 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#091328] rounded-2xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-white/10 shadow-2xl transition-colors duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Add Event - {months[currentDate.getMonth()]} {selectedDay}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a2544] border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a2544] border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:text-white"
                >
                  <option value="session">Live Session</option>
                  <option value="exam">Exam/Quiz</option>
                  <option value="deadline">Deadline</option>
                  <option value="milestone">Milestone</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
