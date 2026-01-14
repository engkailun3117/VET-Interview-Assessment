import { useState, useEffect } from 'react';

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
];

const AddHabitModal = ({ habit, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    color: PRESET_COLORS[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        description: habit.description || '',
        frequency: habit.frequency || 'daily',
        color: habit.color || PRESET_COLORS[0],
      });
    }
  }, [habit]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Habit name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        description: formData.description.trim(),
        frequency: formData.frequency,
        color: formData.color,
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-purple-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {habit ? '✏️ Edit Habit' : '✨ New Habit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl transition-colors shadow-sm"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Habit Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Habit Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Morning Exercise, Read for 30 min"
              maxLength={50}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">{formData.name.length}/50 characters</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add some notes about this habit..."
              rows={3}
              maxLength={200}
            />
            <p className="mt-1 text-xs text-gray-500">{formData.description.length}/200 characters</p>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency
            </label>
            <div className="flex gap-3">
              <label className="flex-1">
                <input
                  type="radio"
                  name="frequency"
                  value="daily"
                  checked={formData.frequency === 'daily'}
                  onChange={(e) => handleChange('frequency', e.target.value)}
                  className="sr-only peer"
                />
                <div className="px-4 py-3 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all text-center">
                  <div className="font-medium text-gray-800">Daily</div>
                  <div className="text-xs text-gray-500 mt-1">Every day</div>
                </div>
              </label>
              <label className="flex-1">
                <input
                  type="radio"
                  name="frequency"
                  value="weekly"
                  checked={formData.frequency === 'weekly'}
                  onChange={(e) => handleChange('frequency', e.target.value)}
                  className="sr-only peer"
                />
                <div className="px-4 py-3 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all text-center">
                  <div className="font-medium text-gray-800">Weekly</div>
                  <div className="text-xs text-gray-500 mt-1">Once a week</div>
                </div>
              </label>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleChange('color', color)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {habit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;
