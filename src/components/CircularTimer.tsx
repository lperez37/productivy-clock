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
import useSound from 'use-sound';

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
  const [playEndSound] = useSound('/timer-end.mp3', { 
    volume: 0.75,
    interrupt: true,
    soundEnabled: !inputMode,
  });
  const prevIsTimeUpRef = useRef(isTimeUp);

  // Play sound when timer ends
  useEffect(() => {
    if (isTimeUp && !prevIsTimeUpRef.current) {
      console.log('Timer ended, playing sound...');
      try {
        playEndSound();
      } catch (error) {
        if (!(error instanceof DOMException)) {
          console.error('Error playing sound:', error);
        }
      }
    }
    prevIsTimeUpRef.current = isTimeUp;
  }, [isTimeUp, playEndSound]);

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
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 9999) {
      setInitialMinutes(numValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePlayClick();
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
  const radius = 140;
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
    if (isNaN(numValue) || numValue <= 0 || numValue > 9999) {
      setIsInvalidAttempt(true);
      return;
    }
    onStart();
  };

  return (
    <div className={`relative w-[350px] h-[350px] mt-4 sm:mt-0 ${isInvalidAttempt ? 'shake' : ''}`}>
      <svg className={`${isTimeUp ? 'shake' : ''} transform -rotate-90 w-full h-full`}>
        <circle
          cx="175"
          cy="175"
          r={radius}
          stroke="currentColor"
          strokeWidth="24"
          fill="transparent"
          className="text-[var(--latte-surface0)] dark:text-[var(--mocha-surface0)]"
        />
        <circle
          cx="175"
          cy="175"
          r={radius}
          stroke="currentColor"
          strokeWidth="24"
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
            className="px-6 py-2 rounded-lg bg-[var(--latte-blue)] dark:bg-[var(--mocha-blue)] text-white dark:text-[var(--mocha-crust)] transition-colors shadow-lg hover:shadow-xl hover:opacity-90 font-medium"
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
              onKeyDown={handleKeyDown}
              className="w-32 text-5xl font-bold text-center bg-transparent border-b-2 border-[var(--latte-surface1)] dark:border-[var(--mocha-surface1)] focus:outline-none focus:border-[var(--latte-mauve)] dark:focus:border-[var(--mocha-mauve)] font-mono"
              max="9999"
              min="1"
            />
            <span className="text-sm text-[var(--latte-subtext1)] dark:text-[var(--mocha-subtext1)] mt-1">minutes</span>
          </div>
        ) : (
          <div className={`text-6xl font-bold font-mono ${!isRunning && !isTimeUp && !inputMode ? 'blink' : ''}`}>
            {formatTime(currentTime)}
          </div>
        )}
      </div>

      <div className="absolute bottom-[-70px] left-1/2 transform -translate-x-1/2 flex gap-6">
        {!isTimeUp && (
          <button
            onClick={isRunning ? onPause : handlePlayClick}
            className="p-4 rounded-full bg-[var(--latte-mauve)] dark:bg-[var(--mocha-mauve)] text-white transition-colors hover:opacity-90"
          >
            {isRunning ? <Pause size={32} /> : <Play size={32} />}
          </button>
        )}
        <button
          onClick={handleReset}
          className="p-4 rounded-full bg-[var(--latte-surface1)] dark:bg-[var(--mocha-surface1)] transition-colors hover:opacity-90"
        >
          <RotateCcw size={32} />
        </button>
      </div>
    </div>
  );
};