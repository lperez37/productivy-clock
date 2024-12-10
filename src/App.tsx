/**
 * Main application component that manages the timer and task state.
 * Features include a Pomodoro-style timer, task management, and theme switching.
 */

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CircularTimer } from './components/CircularTimer';
import { TaskList } from './components/TaskList';
import { ThemeToggle } from './components/ThemeToggle';
import { GithubLink } from './components/GithubLink';
import { NotificationSetup, NotificationConfig } from './components/NotificationSetup';
import { Task, TimerState } from './types';
import './index.css';

function App() {
  // Initialize dark mode based on system preference or stored value
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const darkMode = localStorage.getItem('darkMode');
      if (darkMode !== null) {
        return JSON.parse(darkMode);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  // Initialize tasks from localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  // Timer state with initial time, current time, running status, and extra time count
  const [timer, setTimer] = useState<TimerState>(() => {
    const saved = localStorage.getItem('timerState');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.lastUpdated && parsed.isRunning) {
        const elapsedMinutes = (Date.now() - parsed.lastUpdated) / 1000 / 60;
        const newCurrentTime = Math.max(0.016, parsed.currentTime - elapsedMinutes); // 0.016 is ~1 second
        return {
          ...parsed,
          currentTime: newCurrentTime,
        };
      }
      return parsed;
    }
    return {
      initialTime: 25,
      currentTime: 25,
      isRunning: false,
      extraTimeCount: 0,
    };
  });

  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig | null>(() => {
    const saved = localStorage.getItem('notificationConfig');
    return saved ? JSON.parse(saved) : null;
  });
  const [isNotificationSetupOpen, setIsNotificationSetupOpen] = useState(false);

  // Calculate timer progress and status
  const progress = timer.currentTime / timer.initialTime;
  const isTimeUp = !timer.isRunning && timer.currentTime <= 0;

  // Persist tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save notification config to localStorage
  useEffect(() => {
    if (notificationConfig) {
      localStorage.setItem('notificationConfig', JSON.stringify(notificationConfig));
    } else {
      localStorage.removeItem('notificationConfig');
    }
  }, [notificationConfig]);

  // Send notification when timer is up
  useEffect(() => {
    if (isTimeUp && notificationConfig) {
      fetch(`${notificationConfig.server}/${notificationConfig.topic}`, {
        method: 'POST',
        body: notificationConfig.message || 'This notification comes from your Productivy Clock',
        headers: {
          'Title': 'Time is up!',
          'Priority': 'urgent',
          'Tags': 'stopwatch'
        }
      }).catch(console.error);
    }
  }, [isTimeUp, notificationConfig]);

  // Apply theme changes to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  // Timer countdown effect
  useEffect(() => {
    let interval: number;
    if (timer.isRunning && timer.currentTime > 0) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          currentTime: prev.currentTime - 1/60,
        }));
      }, 1000);
    } else if (timer.currentTime <= 0 && timer.isRunning) {
      setTimer(prev => ({ ...prev, isRunning: false }));
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.currentTime]);

  // Add effect to save timer state
  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify({
      ...timer,
      lastUpdated: Date.now()
    }));
  }, [timer]);

  // Add visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && timer.isRunning) {
        const saved = localStorage.getItem('timerState');
        if (saved) {
          const savedTimer = JSON.parse(saved);
          if (savedTimer.lastUpdated) {
            const elapsedMinutes = (Date.now() - savedTimer.lastUpdated) / 1000 / 60;
            setTimer(prev => ({
              ...prev,
              currentTime: Math.max(0, prev.currentTime - elapsedMinutes),
            }));
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [timer.isRunning]);

  // Timer control handlers
  const handleStartTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: true }));
  };

  const handlePauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const handleResetTimer = () => {
    setTimer(prev => ({
      ...prev,
      currentTime: prev.initialTime,
      isRunning: false,
      extraTimeCount: 0,
    }));
  };

  // Add 5 minutes to timer (limited to 3 times)
  const handleAddFiveMinutes = () => {
    if (timer.extraTimeCount >= 3) {
      alert("Maybe it's time to take a break?");
      return;
    }
    setTimer({
      initialTime: 5,
      currentTime: 5,
      isRunning: true,
      extraTimeCount: timer.extraTimeCount + 1,
    });
  };

  // Task management handlers
  const handleAddTask = (text: string) => {
    setTasks(prev => [...prev, { id: Date.now().toString(), text, completed: false }]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => {
      const newTasks = prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      
      // Trigger confetti when all tasks are completed
      if (newTasks.every(task => task.completed) && newTasks.length > 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      return newTasks;
    });
  };

  const handleClearTasks = () => {
    setTasks([]);
  };

  const handleUpdateTask = (id: string, text: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, text } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleReorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const handleNotificationSetup = (config: NotificationConfig) => {
    setNotificationConfig(config);
  };

  const handleRemoveNotification = () => {
    setNotificationConfig(null);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="container relative mx-auto px-4 py-8 flex flex-col min-h-screen">
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <GithubLink url="https://github.com/lperez37/productivy-clock" />
          <ThemeToggle 
            isDark={isDark} 
            onToggle={() => setIsDark((prev: boolean) => !prev)} 
          />
        </div>
        
        <div className="flex-1 flex flex-col items-center gap-12 mt-16">
          <CircularTimer
            initialMinutes={timer.initialTime}
            currentTime={timer.currentTime}
            isRunning={timer.isRunning}
            onStart={handleStartTimer}
            onPause={handlePauseTimer}
            onReset={handleResetTimer}
            progress={progress}
            setInitialMinutes={(minutes) => 
              setTimer(prev => ({ ...prev, initialTime: minutes, currentTime: minutes }))
            }
            isTimeUp={isTimeUp}
            onAddFiveMinutes={isTimeUp ? handleAddFiveMinutes : undefined}
          />

          <TaskList
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onClearTasks={handleClearTasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onReorderTasks={handleReorderTasks}
          />
        </div>

        <div className="mt-16 mb-4 text-center">
          {notificationConfig ? (
            <p className="text-xs text-black/40 dark:text-[var(--mocha-subtext1)]">
              <button
                onClick={() => setIsNotificationSetupOpen(true)}
                className="text-[var(--latte-blue)] dark:text-[var(--mocha-blue)] hover:underline"
              >
                Edit
              </button>
              {' or '}
              <button
                onClick={handleRemoveNotification}
                className="text-[var(--latte-red)] dark:text-[var(--mocha-red)] hover:underline"
              >
                remove
              </button>
              {' your push notification'}
            </p>
          ) : (
            <button
              onClick={() => setIsNotificationSetupOpen(true)}
              className="text-xs text-black/40 dark:text-[var(--mocha-subtext1)] hover:text-black/60 dark:hover:text-[var(--mocha-text)] transition-colors"
            >
              Set up push notifications
            </button>
          )}
        </div>

        <NotificationSetup
          isOpen={isNotificationSetupOpen}
          onClose={() => setIsNotificationSetupOpen(false)}
          onSave={handleNotificationSetup}
          existingConfig={notificationConfig || undefined}
        />
      </div>
    </div>
  );
}

export default App;