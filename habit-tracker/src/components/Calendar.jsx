import { useState } from 'react';

const Calendar = ({ habits, completions, currentMonth, setCurrentMonth, toggleCompletion }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isFutureDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const getCompletionCount = (date) => {
    if (!date) return 0;
    const dateKey = date.toISOString().split('T')[0];
    const habitCompletions = completions[dateKey] || [];
    return habitCompletions.length;
  };

  const getCompletionPercentage = (date) => {
    if (!date || habits.length === 0) return 0;
    const count = getCompletionCount(date);
    return (count / habits.length) * 100;
  };

  const handleDateClick = (date) => {
    if (!date || isFutureDate(date)) return;
    setSelectedDate(date);
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const getCompletedHabitsForDate = (date) => {
    if (!date) return [];
    const dateKey = date.toISOString().split('T')[0];
    const habitIds = completions[dateKey] || [];
    return habits.filter(h => habitIds.includes(h.id));
  };

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-2xl p-6 border border-purple-100">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button
          onClick={nextMonth}
          className="p-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
          <div key={day} className={`text-center text-sm font-bold py-2 rounded-lg ${
            idx === 0 ? 'text-red-600 bg-red-50' :
            idx === 6 ? 'text-blue-600 bg-blue-50' :
            'text-purple-700 bg-purple-50'
          }`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          const percentage = getCompletionPercentage(date);
          const isFuture = isFutureDate(date);
          const selected = isDateSelected(date);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={!date || isFuture}
              className={`
                aspect-square p-2 rounded-xl border-2 transition-all relative font-semibold
                ${!date ? 'invisible' : ''}
                ${isFuture ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'cursor-pointer bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50'}
                ${isToday(date) ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-lg ring-2 ring-orange-300' : 'border-purple-200'}
                ${selected ? 'ring-4 ring-pink-400 ring-offset-2 shadow-xl scale-105' : ''}
                ${!isFuture && date && percentage === 100 ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-400' : ''}
                ${!isFuture && date ? 'hover:shadow-lg hover:scale-105' : ''}
              `}
            >
              {date && (
                <>
                  <div className={`text-sm font-bold ${
                    isToday(date) ? 'text-orange-700' :
                    percentage === 100 ? 'text-green-700' :
                    'text-gray-700'
                  }`}>
                    {date.getDate()}
                  </div>
                  {!isFuture && percentage > 0 && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full transition-all ${
                            percentage === 100 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                            percentage >= 66 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                            percentage >= 33 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            'bg-gradient-to-r from-red-400 to-pink-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDate && habits.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          <div className="space-y-2">
            {habits.map(habit => {
              const dateKey = selectedDate.toISOString().split('T')[0];
              const isCompleted = (completions[dateKey] || []).includes(habit.id);

              return (
                <label
                  key={habit.id}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => toggleCompletion(selectedDate, habit.id)}
                    className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className={`ml-3 flex-1 ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {habit.name}
                  </span>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}

      {habits.length === 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-500">
          Add your first habit to start tracking!
        </div>
      )}
    </div>
  );
};

export default Calendar;
