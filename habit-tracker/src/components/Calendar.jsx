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
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
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
                aspect-square p-2 rounded-lg border-2 transition-all relative
                ${!date ? 'invisible' : ''}
                ${isFuture ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                ${isToday(date) ? 'border-blue-500' : 'border-gray-200'}
                ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                ${!isFuture && date ? 'hover:border-blue-300 hover:shadow-md' : ''}
              `}
            >
              {date && (
                <>
                  <div className="text-sm font-medium text-gray-800">
                    {date.getDate()}
                  </div>
                  {!isFuture && percentage > 0 && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            percentage === 100 ? 'bg-green-500' : 'bg-blue-500'
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
