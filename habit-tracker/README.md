# Habit Tracker with Calendar View

A motivational personal development tool that helps users establish and maintain habits through visual tracking and insightful statistics.

## 🔗 Live Demo

https://vet-interview-assessment.vercel.app/

## 📋 Project Choice

**Project #3: The Habit Tracker with Calendar View**

I chose this project because it presents an excellent opportunity to create a practical, user-focused application that combines visual design with meaningful data analysis. The calendar interface provides an intuitive way for users to track their progress, while statistics like streaks and consistency metrics offer motivational insights that can genuinely help people build better habits.

## 🛠️ Justification of Tools

### Frontend Framework: **React 19 + Vite**
- **React 19**: Latest version providing improved hooks, better performance, and modern development patterns. React's component-based architecture is perfect for building reusable UI elements like calendar cells and habit cards.
- **Vite**: Ultra-fast build tool and development server. Chosen for its instant hot module replacement (HMR), optimized builds, and seamless React integration. Significantly faster than traditional webpack-based setups.

### Styling: **Tailwind CSS v3**
- Utility-first CSS framework enabling rapid UI development
- Built-in responsive design utilities for mobile-first approach
- Consistent design system with customizable color palette
- No CSS-in-JS runtime overhead
- Smaller bundle size compared to component libraries

### State Management: **React Hooks (useState, useEffect)**
- Lightweight solution perfect for application scope
- No external dependencies required
- Simple and maintainable code structure
- Built-in React capabilities sufficient for the data flow needs

### Data Persistence: **localStorage API**
- Browser-native solution requiring no backend infrastructure
- Instant data access without network latency
- Perfect for single-user, client-side applications
- Easy to implement with JSON serialization
- Persistent data across browser sessions

### Deployment: **Vercel / Netlify**
- Zero-configuration deployment for Vite projects
- Automatic HTTPS and CDN distribution
- Free tier suitable for demonstration purposes
- Git integration for continuous deployment
- Global edge network for fast loading times

## 🎯 High-Level Approach

### Architecture Strategy

I employed a **component-based architecture** with clear separation of concerns:

1. **App.jsx**: Central state management and orchestration
   - Manages habits array and completions object
   - Handles localStorage synchronization
   - Coordinates communication between components

2. **Calendar.jsx**: Primary user interface
   - Renders monthly calendar grid
   - Displays completion progress visually
   - Enables habit completion toggling per date
   - Implements month navigation

3. **Statistics.jsx**: Analytics engine
   - Calculates current and best streaks
   - Computes monthly consistency percentages
   - Aggregates overall completion metrics

4. **HabitList.jsx**: Habit management sidebar
   - Lists all active habits with color coding
   - Provides CRUD operation triggers
   - Displays habit metadata (frequency, description)

5. **AddHabitModal.jsx**: Form interface
   - Creates and edits habits
   - Validates user input
   - Offers color and frequency customization

### Data Structure Design

```javascript
// Habits: Array of habit objects
[
  {
    id: "1234567890",
    name: "Morning Exercise",
    description: "30 minutes of cardio",
    frequency: "daily",
    color: "#3B82F6",
    createdAt: "2026-01-14T07:30:00.000Z"
  }
]

// Completions: Date-keyed object mapping to habit IDs
{
  "2026-01-14": ["1234567890", "0987654321"],
  "2026-01-13": ["1234567890"]
}
```

This structure optimizes for:
- Fast lookup by date for calendar rendering
- Efficient completion toggling
- Simple streak calculation through date iteration

### Implementation Flow

1. **No Backend Required**: Pure client-side application
2. **Single Rendering Pipeline**: Data flows from App → Components
3. **Reactive Updates**: Changes trigger automatic re-renders via React's state system
4. **Persistent by Default**: All state changes automatically sync to localStorage

## 📝 Final Prompts

Since this is a traditional software development project rather than an LLM-powered application, the "prompts" refer to the development approach and key implementation decisions:

### Core Development Principles

```
Build a habit tracker with these requirements:
1. Calendar-first interface showing 30+ days at a glance
2. Visual progress indicators using color-coded completion bars
3. Statistical insights including:
   - Current streak (consecutive days of completion)
   - Best streak (historical maximum)
   - Monthly consistency (% of days completed)
4. Intuitive habit management (add, edit, delete with color customization)
5. Responsive design working on mobile and desktop
6. Data persistence across browser sessions
7. No user accounts needed - single-user local storage
8. Clean, modern UI with gradient backgrounds and smooth transitions
```

### Algorithm Design: Streak Calculation

```javascript
/**
 * Calculate current streak for a habit
 *
 * Logic:
 * 1. Start from yesterday (today doesn't count until tomorrow)
 * 2. Count backwards through consecutive completed days
 * 3. Stop at first gap
 * 4. Add today if completed
 *
 * Example:
 * - Completed: Jan 14, 13, 12, 11, 10, 8, 7
 * - Current Date: Jan 14
 * - Streak: 5 (Jan 10-14, gap on Jan 9)
 */
const calculateStreak = (habitId) => {
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  // Include today if completed
  const todayKey = today.toISOString().split('T')[0];
  if ((completions[todayKey] || []).includes(habitId)) {
    streak++;
  }

  return streak;
};
```

## 🚀 Instructions

### Prerequisites

- Node.js 18+ and npm installed
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git (for cloning repository)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/engkailun3117/VET-Interview-Assessment.git
   cd VET-Interview-Assessment/habit-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - Application will hot-reload on code changes

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Running Production Build Locally

```bash
npm run preview
```

Serves the production build at `http://localhost:4173`.

### Deployment

#### Option 1: Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow prompts to deploy

#### Option 2: Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify deploy --prod`
3. Follow prompts to deploy

Alternatively, connect your GitHub repository to Vercel or Netlify for automatic deployments on push.

## 🎯 How to Use the Application

1. **Add Your First Habit**
   - Click "Add Habit" button
   - Enter habit name (e.g., "Morning Run")
   - Optionally add description
   - Choose daily or weekly frequency
   - Select a color for visual identification
   - Click "Create Habit"

2. **Track Completions**
   - Click any past or current date on the calendar
   - Check/uncheck habits you completed that day
   - Progress bars update automatically

3. **View Statistics**
   - Current streak shows consecutive completion days
   - Best streak shows your all-time record
   - Monthly consistency shows % of days completed
   - Overall stats aggregate all habits

4. **Manage Habits**
   - Hover over habits in the sidebar
   - Click edit icon to modify details
   - Click delete icon to remove (with confirmation)

## 🧗 Challenges & Iterations

### Challenge 1: Date Handling Across Timezones

**Problem**: JavaScript Date objects include time and timezone information, causing issues when comparing dates. A completion at 11 PM might show on the wrong calendar day due to timezone conversions.

**Solution**: Standardized all date comparisons using ISO date strings (YYYY-MM-DD format) extracted from Date objects:
```javascript
const dateKey = date.toISOString().split('T')[0];
```

This ensures consistent date keys regardless of timezone or time of day.

**Iterations**:
- v1: Used `date.toDateString()` - inconsistent across browsers
- v2: Used `date.getTime()` - required complex millisecond calculations
- v3 (Final): ISO string splitting - simple and reliable

### Challenge 2: Streak Calculation Logic

**Problem**: Initial implementation counted today in the streak even if not completed, inflating streak counts and confusing users.

**Solution**: Implemented two-phase streak calculation:
1. Count backwards from yesterday
2. Add today only if completed

This accurately reflects "days in a row" while allowing today's completion to extend the streak.

**Iterations**:
- v1: Counted all consecutive days from today backward - always showed minimum 1 day streak
- v2: Only counted past days - today's completion didn't update streak
- v3 (Final): Hybrid approach - accurate and intuitive

### Challenge 3: Calendar Grid Alignment

**Problem**: Month grids didn't align properly because months start on different days of the week, causing layout shifts and confusing UX.

**Solution**: Added empty placeholder cells before the first day of the month using `Array.fill()`:
```javascript
const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
for (let i = 0; i < startingDayOfWeek; i++) {
  days.push(null);
}
```

**Iterations**:
- v1: Started all months on Monday - inaccurate day labels
- v2: Used CSS grid-column-start - complex and browser-dependent
- v3 (Final): Placeholder cells - simple and consistent

### Challenge 4: localStorage Synchronization

**Problem**: Initial implementation saved to localStorage on every state update, causing performance issues and potential data races.

**Solution**: Used React's `useEffect` with dependency arrays to batch updates:
```javascript
useEffect(() => {
  localStorage.setItem('habits', JSON.stringify(habits));
}, [habits]);
```

This saves only when data actually changes, not on every render.

**Iterations**:
- v1: Saved in event handlers - error-prone and scattered logic
- v2: Saved on every render - severe performance degradation
- v3 (Final): Effect-based saving - performant and reliable

### Challenge 5: Modal Focus Management

**Problem**: When the add/edit modal opened, users could still interact with background elements, causing confusion and potential data inconsistencies.

**Solution**: Added z-index layering and semi-transparent backdrop:
```javascript
className="fixed inset-0 bg-black bg-opacity-50 z-50"
```

**Iterations**:
- v1: Modal without backdrop - poor UX
- v2: Backdrop without proper z-index - still clickable background
- v3 (Final): Proper layering and visual separation

### Challenge 6: Responsive Design for Calendar

**Problem**: Calendar grid became too cramped on mobile devices, with date numbers and progress bars overlapping.

**Solution**: Implemented responsive font sizes and padding using Tailwind's breakpoints, and made progress bars conditionally visible:
```javascript
className="aspect-square p-2" // Maintains square cells
className="text-sm md:text-base" // Responsive text sizing
```

**Iterations**:
- v1: Fixed sizes - broke on small screens
- v2: Percentage-based sizing - inconsistent aspect ratios
- v3 (Final): Aspect-ratio + responsive utilities - works on all screens

## 📊 Project Statistics

- **Components**: 5 main React components
- **Lines of Code**: ~700 (excluding comments)
- **Dependencies**: 4 runtime + 9 development
- **Build Size**: ~212 KB (65 KB gzipped)
- **Development Time**: Structured for iterative development
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

## 🌟 Features Implemented

- ✅ Calendar interface with month navigation
- ✅ Visual progress indicators (completion bars)
- ✅ Current streak calculation
- ✅ Best streak tracking
- ✅ Monthly consistency percentage
- ✅ Habit CRUD operations
- ✅ Color-coded habits
- ✅ Daily/Weekly frequency options
- ✅ LocalStorage persistence
- ✅ Responsive design
- ✅ Form validation
- ✅ Confirmation dialogs
- ✅ Accessible UI (ARIA labels)

## 📄 License

This project was created as an assessment submission for VET Interview Assessment.

## 👤 Author

Created as part of the VET Interview Assessment by the candidate Eng Kai Lun.
