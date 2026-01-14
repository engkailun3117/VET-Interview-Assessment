import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import HabitList from './components/HabitList';
import Statistics from './components/Statistics';
import AddHabitModal from './components/AddHabitModal';

function App() {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedCompletions = localStorage.getItem('completions');

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    if (savedCompletions) {
      setCompletions(JSON.parse(savedCompletions));
    }
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  // Save completions to localStorage
  useEffect(() => {
    localStorage.setItem('completions', JSON.stringify(completions));
  }, [completions]);

  const addHabit = (habitData) => {
    const newHabit = {
      id: Date.now().toString(),
      ...habitData,
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
  };

  const updateHabit = (habitId, habitData) => {
    setHabits(habits.map(h => h.id === habitId ? { ...h, ...habitData } : h));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(h => h.id !== habitId));
    // Clean up completions for deleted habit
    const newCompletions = { ...completions };
    Object.keys(newCompletions).forEach(date => {
      if (newCompletions[date].includes(habitId)) {
        newCompletions[date] = newCompletions[date].filter(id => id !== habitId);
        if (newCompletions[date].length === 0) {
          delete newCompletions[date];
        }
      }
    });
    setCompletions(newCompletions);
  };

  const toggleCompletion = (date, habitId) => {
    const dateKey = date.toISOString().split('T')[0];
    const currentCompletions = completions[dateKey] || [];

    if (currentCompletions.includes(habitId)) {
      // Remove completion
      const updated = currentCompletions.filter(id => id !== habitId);
      if (updated.length === 0) {
        const { [dateKey]: _, ...rest } = completions;
        setCompletions(rest);
      } else {
        setCompletions({ ...completions, [dateKey]: updated });
      }
    } else {
      // Add completion
      setCompletions({
        ...completions,
        [dateKey]: [...currentCompletions, habitId],
      });
    }
  };

  const openAddModal = () => {
    setSelectedHabit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (habit) => {
    setSelectedHabit(habit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHabit(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Habit Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Build better habits, one day at a time
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar Section */}
          <div className="lg:col-span-2 space-y-6">
            <Calendar
              habits={habits}
              completions={completions}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              toggleCompletion={toggleCompletion}
            />

            <Statistics
              habits={habits}
              completions={completions}
              currentMonth={currentMonth}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <HabitList
              habits={habits}
              onAddHabit={openAddModal}
              onEditHabit={openEditModal}
              onDeleteHabit={deleteHabit}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AddHabitModal
          habit={selectedHabit}
          onClose={closeModal}
          onSave={(habitData) => {
            if (selectedHabit) {
              updateHabit(selectedHabit.id, habitData);
            } else {
              addHabit(habitData);
            }
            closeModal();
          }}
        />
      )}
    </div>
  );
}

export default App;
