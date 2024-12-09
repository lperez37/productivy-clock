
import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import { CircularTimer } from './components/CircularTimer';
import { TaskList } from './components/TaskList';
import { ThemeToggle } from './components/ThemeToggle';
import { Task, TimerState } from './types';
import './index.css';

function App() {
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [timer, setTimer] = useState<TimerState>({
    initialTime: 25,
    currentTime: 25,
    isRunning: false,
    extraTimeCount: 0,
  });

  const [playAlarm] = useSound('/alarm.mp3', { volume: 0.5 });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

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
      if (soundEnabled) playAlarm();
      setTimer(prev => ({ ...prev, isRunning: false }));
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.currentTime, soundEnabled, playAlarm]);

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

  const handleAddFiveMinutes = () => {
    if (timer.extraTimeCount >= 3) {
      alert("Maybe it's time to take a break?");
    }
    setTimer(prev => ({
      ...prev,
      currentTime: prev.currentTime + 5,
      extraTimeCount: prev.extraTimeCount + 1,
    }));
  };

  const handleAddTask = (text: string) => {
    setTasks(prev => [...prev, { id: Date.now().toString(), text, completed: false }]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => {
      const newTasks = prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      
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

  const progress = timer.currentTime / timer.initialTime;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <div className="container mx-auto px-4 py-8">
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(prev => !prev)} />
        
        <button
          onClick={() => setSoundEnabled(prev => !prev)}
          className="fixed top-4 left-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        <div className="flex flex-col items-center gap-8">
          <CircularTimer
            initialMinutes={timer.initialTime}
            isRunning={timer.isRunning}
            onStart={handleStartTimer}
            onPause={handlePauseTimer}
            onReset={handleResetTimer}
            progress={progress}
            setInitialMinutes={(minutes) => 
              setTimer(prev => ({ ...prev, initialTime: minutes, currentTime: minutes }))
            }
          />

          {!timer.isRunning && timer.currentTime <= 0 && (
            <button
              onClick={handleAddFiveMinutes}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              Add 5 Minutes
            </button>
          )}

          <TaskList
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onClearTasks={handleClearTasks}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
      