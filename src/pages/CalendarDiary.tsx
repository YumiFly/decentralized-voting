import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import '../css/CalendarDiary.css';
import { Calendar } from 'antd';

const CalendarDiary: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<{ [key: string]: string }>({});

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
//   const daysInMonth = eachDayOfMonth({ start: monthStart, end: monthEnd });
const daysInMonth = Array.from(
    { length: monthEnd.getDate() },
    (_, i) => new Date(monthStart.getFullYear(), monthStart.getMonth(), i + 1)
  );

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleDiaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedDate) {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      setDiaryEntries({ ...diaryEntries, [dateKey]: e.target.value });
    }
  };

  return (
    <div className="calendar-diary-container">
      <div className="header">
        <button onClick={goToPreviousMonth}>{'<'}</button>
        <h2>{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={goToNextMonth}>{'>'}</button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
        {daysInMonth.map((day: Date) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateKey;
          return (
            <div
              key={dateKey}
              className={`day ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>

      <div className="diary-section">
        {selectedDate ? (
          <>
            <h3>{format(selectedDate, 'MMMM d, yyyy')}</h3>
            <textarea
              value={diaryEntries[format(selectedDate, 'yyyy-MM-dd')] || ''}
              onChange={handleDiaryChange}
              placeholder="Write your diary entry here..."
            />
          </>
        ) : (
          <p>Select a date to write a diary entry.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarDiary;