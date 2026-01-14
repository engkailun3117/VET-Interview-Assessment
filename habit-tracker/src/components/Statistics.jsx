const Statistics = ({ habits, completions, currentMonth }) => {
  // Calculate current streak for a habit
  const calculateStreak = (habitId) => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from yesterday and go backwards
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);

    while (true) {
      const dateKey = checkDate.toISOString().split('T')[0];
      const dayCompletions = completions[dateKey] || [];

      if (dayCompletions.includes(habitId)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Check if today is completed (include in streak)
    const todayKey = today.toISOString().split('T')[0];
    const todayCompletions = completions[todayKey] || [];
    if (todayCompletions.includes(habitId)) {
      streak++;
    }

    return streak;
  };

  // Calculate best streak for a habit
  const calculateBestStreak = (habitId) => {
    let bestStreak = 0;
    let currentStreak = 0;

    // Get all dates sorted
    const allDates = Object.keys(completions)
      .filter(date => completions[date].includes(habitId))
      .sort();

    if (allDates.length === 0) return 0;

    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prevDate = new Date(allDates[i - 1]);
        const currDate = new Date(allDates[i]);
        const dayDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
          currentStreak++;
        } else {
          bestStreak = Math.max(bestStreak, currentStreak);
          currentStreak = 1;
        }
      }
    }

    return Math.max(bestStreak, currentStreak);
  };

  // Calculate monthly completion percentage for a habit
  const calculateMonthlyConsistency = (habitId) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    let daysToCount = daysInMonth;
    // If current month, only count up to today
    if (year === today.getFullYear() && month === today.getMonth()) {
      daysToCount = today.getDate();
    }

    let completedDays = 0;
    for (let day = 1; day <= daysToCount; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      const dayCompletions = completions[dateKey] || [];
      if (dayCompletions.includes(habitId)) {
        completedDays++;
      }
    }

    return Math.round((completedDays / daysToCount) * 100);
  };

  // Calculate overall statistics
  const calculateOverallStats = () => {
    if (habits.length === 0) return { totalCompletions: 0, avgConsistency: 0 };

    const totalCompletions = Object.values(completions).reduce(
      (sum, dayCompletions) => sum + dayCompletions.length,
      0
    );

    const avgConsistency = Math.round(
      habits.reduce((sum, habit) => sum + calculateMonthlyConsistency(habit.id), 0) / habits.length
    );

    return { totalCompletions, avgConsistency };
  };

  const overallStats = calculateOverallStats();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistics</h2>

      {habits.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Add habits to see statistics
        </div>
      ) : (
        <>
          {/* Overall Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="text-sm text-blue-600 font-medium mb-1">Total Completions</div>
              <div className="text-3xl font-bold text-blue-700">{overallStats.totalCompletions}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div className="text-sm text-green-600 font-medium mb-1">Avg Consistency</div>
              <div className="text-3xl font-bold text-green-700">{overallStats.avgConsistency}%</div>
            </div>
          </div>

          {/* Per-Habit Stats */}
          <div className="space-y-4">
            {habits.map(habit => {
              const currentStreak = calculateStreak(habit.id);
              const bestStreak = calculateBestStreak(habit.id);
              const consistency = calculateMonthlyConsistency(habit.id);

              return (
                <div
                  key={habit.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <h3 className="font-semibold text-gray-800">{habit.name}</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Current Streak</div>
                      <div className="text-xl font-bold text-orange-600 flex items-center gap-1">
                        {currentStreak}
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Best Streak</div>
                      <div className="text-xl font-bold text-purple-600">{bestStreak}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">This Month</div>
                      <div className="text-xl font-bold text-green-600">{consistency}%</div>
                    </div>
                  </div>

                  {/* Progress bar for monthly consistency */}
                  <div className="mt-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                        style={{ width: `${consistency}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;
