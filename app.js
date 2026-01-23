const { useState, useEffect } = React;
const { Calendar, Save, ChevronLeft, ChevronRight } = lucide;

function DailyDiary() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('diaryEntries');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentEntry, setCurrentEntry] = useState({
    acts: '',
    question: '',
    summary: ''
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const dateKey = getDateKey(currentDate);
    if (entries[dateKey]) {
      setCurrentEntry(entries[dateKey]);
    } else {
      setCurrentEntry({ acts: '', question: '', summary: '' });
    }
  }, [currentDate, entries]);

  const saveEntry = () => {
    const dateKey = getDateKey(currentDate);
    const updatedEntries = {
      ...entries,
      [dateKey]: currentEntry
    };
    setEntries(updatedEntries);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
  };

  const handleChange = (field, value) => {
    setCurrentEntry(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const selectDate = (day) => {
    const newDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    setCurrentDate(newDate);
    setShowCalendar(false);
  };

  const previousMonth = () => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCalendarMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCalendarMonth(newMonth);
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(calendarMonth);
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = getDateKey(new Date(year, month, day));
      const hasEntry = entries[dateKey];
      const isSelected = currentDate.getDate() === day && 
                        currentDate.getMonth() === month && 
                        currentDate.getFullYear() === year;
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === month && 
                     new Date().getFullYear() === year;

      days.push(
        <button
          key={day}
          onClick={() => selectDate(day)}
          className={`h-10 rounded-lg flex items-center justify-center relative transition-colors
            ${isSelected ? 'bg-amber-500 text-white font-bold' : ''}
            ${!isSelected && isToday ? 'bg-amber-100 font-semibold' : ''}
            ${!isSelected && !isToday ? 'hover:bg-gray-100' : ''}
          `}
        >
          {day}
          {hasEntry && (
            <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500'}`}></div>
          )}
        </button>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-xl p-4 absolute top-full mt-2 z-10 w-80">
        <div className="flex items-center justify-between mb-4">
          <button onClick={previousMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="font-semibold">
            {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
        <div className="mt-3 pt-3 border-t text-xs text-gray-600 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Has entry</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b-2 border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-amber-900 flex items-center gap-2">
              <Calendar className="w-8 h-8" />
              Daily Diary
            </h1>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Calendar
                </button>
                {showCalendar && renderCalendar()}
              </div>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Today
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-amber-50 rounded-lg p-4">
            <button
              onClick={goToPreviousDay}
              className="p-2 hover:bg-amber-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-amber-700" />
            </button>
            <h2 className="text-xl font-semibold text-amber-800">
              {formatDate(currentDate)}
            </h2>
            <button
              onClick={goToNextDay}
              className="p-2 hover:bg-amber-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-amber-700" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-8 bg-blue-500 rounded"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                10 Minutes: Daily Acts
              </h3>
            </div>
            <textarea
              value={currentEntry.acts}
              onChange={(e) => handleChange('acts', e.target.value)}
              placeholder="What did you do today? Record your activities, accomplishments, and moments..."
              className="w-full h-32 p-4 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none resize-none"
            />
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-8 bg-green-500 rounded"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                10 Minutes: Ask a Question
              </h3>
            </div>
            <textarea
              value={currentEntry.question}
              onChange={(e) => handleChange('question', e.target.value)}
              placeholder="What question arose today? What are you curious about? What do you want to explore or understand better?"
              className="w-full h-32 p-4 border-2 border-green-200 rounded-lg focus:border-green-400 focus:outline-none resize-none"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-8 bg-purple-500 rounded"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                10 Minutes: Summary
              </h3>
            </div>
            <textarea
              value={currentEntry.summary}
              onChange={(e) => handleChange('summary', e.target.value)}
              placeholder="Reflect on your day. What were the key takeaways? How do you feel? What did you learn?"
              className="w-full h-32 p-4 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveEntry}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-md"
            >
              <Save className="w-5 h-5" />
              Save Entry
            </button>
          </div>

          {entries[getDateKey(currentDate)] && (
            <div className="mt-4 text-center text-sm text-green-600">
              ✓ Entry saved for this date
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<DailyDiary />, document.getElementById('root'));