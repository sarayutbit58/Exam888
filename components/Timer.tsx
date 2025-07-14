
import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
}

const IconClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);


const Timer: React.FC<TimerProps> = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const timerColor = timeLeft < 300 ? 'text-red-400' : 'text-slate-200';

  return (
    <div className={`flex items-center text-lg font-bold font-mono p-2 rounded-lg bg-slate-800 border border-slate-700 ${timerColor}`}>
        <IconClock />
        <span>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
    </div>
  );
};

export default Timer;
