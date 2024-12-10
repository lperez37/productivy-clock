/**
 * A circular timer component that displays a countdown with a circular progress indicator.
 * Features include:
 * - Input mode for setting timer duration
 * - Play/Pause functionality
 * - Reset capability
 * - Visual feedback for timer completion
 * - Option to add extra time when timer is up
 */

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface CircularTimerProps {
  initialMinutes: number;
  currentTime: number;
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
  currentTime,
  isRunning,
  onStart,
  onPause,
  onReset,
  progress,
  setInitialMinutes,
  isTimeUp,
  onAddFiveMinutes,
}) => {
  // State for managing input mode and value
  const [inputMode, setInputMode] = useState(true);
  const [inputValue, setInputValue] = useState(initialMinutes.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInvalidAttempt, setIsInvalidAttempt] = useState(false);

  // Auto-focus input when entering input mode
  useEffect(() => {
    if (inputMode && !isRunning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputMode, isRunning]);

  // Toggle input mode based on timer state
  useEffect(() => {
    if (!isRunning && !isTimeUp && currentTime === initialMinutes) {
      setInputMode(true);
    } else {
      setInputMode(false);
    }
  }, [isRunning, isTimeUp, currentTime, initialMinutes]);

  // Add this useEffect to reset the invalid attempt state
  useEffect(() => {
    if (isInvalidAttempt) {
      const timer = setTimeout(() => {
        setIsInvalidAttempt(false);
      }, 820); // Slightly longer than the shake animation
      return () => clearTimeout(timer);
    }
  }, [isInvalidAttempt]);

  // Handle input changes with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Only update initialMinutes if the value is a valid number
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 60) {
      setInitialMinutes(numValue);
    }
  };

  // Handle reset with focus management
  const handleReset = () => {
    onReset();
    setInputMode(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Calculate circle dimensions and progress
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  // Format time display (MM:SS)
  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes * 60) % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Modify the click handler for the play button
  const handlePlayClick = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue <= 0 || numValue > 60) {
      setIsInvalidAttempt(true);
      return;
    }
    onStart();
  };

  return (
    <div className={`relative w-[300px] h-[300px] mt-4 sm:mt-0 ${isInvalidAttempt ? 'shake' : ''}`}>
      <svg className={`${isTimeUp ? 'shake' : ''} transform -rotate-90 w-full h-full`}>
        <circle
          cx="150"
          cy="150"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-[var(--latte-surface0)] dark:text-[var(--mocha-surface0)]"
        />
        <circle
          cx="150"
          cy="150"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={`${!isRunning && !isTimeUp && !inputMode ? 'blink' : ''} text-[var(--latte-mauve)] dark:text-[var(--mocha-mauve)] transition-all duration-500`}
        />
      </svg>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        {isTimeUp && onAddFiveMinutes ? (
          <button
            onClick={onAddFiveMinutes}
            className="px-6 py-2 rounded-lg bg-[var(--latte-blue)] dark:bg-[var(--mocha-blue)] text-white transition-colors shadow-lg hover:shadow-xl hover:opacity-90"
          >
            Add 5 Minutes
          </button>
        ) : inputMode ? (
          <div className="flex flex-col items-center">
            <input
              ref={inputRef}
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              className="w-24 text-4xl font-bold text-center bg-transparent border-b-2 border-[var(--latte-surface1)] dark:border-[var(--mocha-surface1)] focus:outline-none focus:border-[var(--latte-mauve)] dark:focus:border-[var(--mocha-mauve)]"
              max="60"
              min="1"
            />
            <span className="text-sm text-[var(--latte-subtext1)] dark:text-[var(--mocha-subtext1)] mt-1">minutes</span>
          </div>
        ) : (
          <div className={`text-4xl font-bold ${!isRunning && !isTimeUp && !inputMode ? 'blink' : ''}`}>
            {formatTime(currentTime)}
          </div>
        )}
      </div>

      <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={isRunning ? onPause : handlePlayClick}
          className="p-3 rounded-full bg-[var(--latte-mauve)] dark:bg-[var(--mocha-mauve)] text-white transition-colors hover:opacity-90"
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={handleReset}
          className="p-3 rounded-full bg-[var(--latte-surface1)] dark:bg-[var(--mocha-surface1)] transition-colors hover:opacity-90"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};