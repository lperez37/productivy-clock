import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface CircularTimerProps {
  initialMinutes: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  progress: number;
  setInitialMinutes: (minutes: number) => void;
  isTimeUp: boolean;
  onAddFiveMinutes?: () => void;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  initialMinutes,
  isRunning,
  onStart,
  onPause,
  onReset,
  progress,
  setInitialMinutes,
  isTimeUp,
  onAddFiveMinutes,
}) => {
  const [inputMode, setInputMode] = useState(true);
  const [inputValue, setInputValue] = useState(initialMinutes.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputMode && !isRunning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputMode, isRunning]);

  useEffect(() => {
    if (!isRunning && !isTimeUp) {
      setInputMode(true);
    }
  }, [isRunning, isTimeUp]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 60) {
      setInputValue(e.target.value);
      setInitialMinutes(value);
    }
  };

  const handleReset = () => {
    onReset();
    setInputMode(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes * 60) % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-[300px] h-[300px]">
      <svg className={`${isTimeUp ? 'shake' : 'transform -rotate-90'} w-full h-full`}>
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
        {isTimeUp && onAddFiveMinutes ? (
          <button
            onClick={onAddFiveMinutes}
            className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-lg hover:shadow-xl"
          >
            Add 5 Minutes
          </button>
        ) : inputMode && !isRunning && !isTimeUp ? (
          <div className="flex flex-col items-center">
            <input
              ref={inputRef}
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              className="w-24 text-4xl font-bold text-center bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-red-500"
              max="60"
              min="1"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">minutes</span>
          </div>
        ) : (
          <div className={`text-4xl font-bold ${!isRunning && !isTimeUp ? 'animate-pulse' : ''}`}>
            {formatTime(initialMinutes * progress)}
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
          onClick={handleReset}
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};