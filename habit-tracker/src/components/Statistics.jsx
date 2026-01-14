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
    <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-2xl p-6 border border-orange-100">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">Statistics 📊</h2>

      {habits.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-gradient-to-br from-orange-100 to-yellow-100 w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-3xl">📈</span>
          </div>
          <p className="text-gray-600 font-medium">Add habits to see statistics</p>
        </div>
      ) : (
        <>
          {/* Overall Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b-2 border-gradient">
            <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105">
              <div className="text-sm text-white font-bold mb-2 flex items-center gap-1">
                <span>🎯</span> Total Completions
              </div>
              <div className="text-4xl font-black text-white">{overallStats.totalCompletions}</div>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105">
              <div className="text-sm text-white font-bold mb-2 flex items-center gap-1">
                <span>📈</span> Avg Consistency
              </div>
              <div className="text-4xl font-black text-white">{overallStats.avgConsistency}%</div>
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
                  className="border-2 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all transform hover:scale-102"
                  style={{
                    borderColor: habit.color,
                    background: `linear-gradient(135deg, white 0%, ${habit.color}15 100%)`
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-5 h-5 rounded-full shadow-md ring-2 ring-white"
                      style={{ backgroundColor: habit.color }}
                    />
                    <h3 className="font-bold text-gray-800 text-lg">{habit.name}</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-orange-700 font-semibold mb-1">🔥 Current</div>
                      <div className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {currentStreak}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-purple-700 font-semibold mb-1">⭐ Best</div>
                      <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {bestStreak}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-green-700 font-semibold mb-1">📅 Month</div>
                      <div className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {consistency}%
                      </div>
                    </div>
                  </div>

                  {/* Progress bar for monthly consistency */}
                  <div className="mt-3">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full transition-all duration-500 ${
                          consistency === 100 ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500' :
                          consistency >= 75 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                          consistency >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                          consistency >= 25 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                          'bg-gradient-to-r from-red-400 to-pink-500'
                        }`}
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
