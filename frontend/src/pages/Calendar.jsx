import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const events = {
    5: { title: 'Machine Learning Quiz', type: 'exam' },
    12: { title: 'Project Deadline', type: 'deadline' },
    18: { title: 'Live Session: Python', type: 'session' },
    25: { title: 'Course Completion', type: 'milestone' },
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            <Plus className="w-5 h-5" />
            Add Event
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            <div className="grid grid-cols-7 gap-4 mb-4">
              {days.map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 text-sm">
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
                const event = events[day];
                return (
                  <div
                    key={day}
                    className={`h-24 p-2 border rounded-lg hover:bg-blue-50 cursor-pointer transition ${
                      event ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-700">{day}</span>
                    {event && (
                      <div className={`mt-1 text-xs px-2 py-1 rounded ${
                        event.type === 'exam' ? 'bg-red-100 text-red-700' :
                        event.type === 'deadline' ? 'bg-yellow-100 text-yellow-700' :
                        event.type === 'session' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {event.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(events).map(([day, event]) => (
              <div key={day} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-600">
                <p className="font-semibold text-gray-900">{event.title}</p>
                <p className="text-sm text-gray-500">{months[currentDate.getMonth()]} {day}, {currentDate.getFullYear()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
