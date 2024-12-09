
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface CircularTimerProps {
  initialMinutes: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  progress: number;
  setInitialMinutes: (minutes: number) => void;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  initialMinutes,
  isRunning,
  onStart,
  onPause,
  onReset,
  progress,
  setInitialMinutes,
}) => {
  const [inputMode, setInputMode] = useState(true);
  const [inputValue, setInputValue] = useState(initialMinutes.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 60) {
      setInputValue(e.target.value);
      setInitialMinutes(value);
    }
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative w-[300px] h-[300px]">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="150"
          cy="150"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="150"
          cy="150"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="text-red-500 transition-all duration-500"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        {inputMode && !isRunning ? (
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            className="w-24 text-4xl font-bold text-center bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-red-500"
            max="60"
            min="1"
          />
        ) : (
          <div className="text-4xl font-bold">
            {Math.floor(initialMinutes * progress)}:
            {String(Math.floor((initialMinutes * progress * 60) % 60)).padStart(2, '0')}
          </div>
        )}
      </div>
      <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={isRunning ? onPause : onStart}
          className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={onReset}
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};
      