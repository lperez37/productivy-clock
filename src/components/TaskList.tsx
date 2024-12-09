import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Check, Plus } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onClearTasks: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onClearTasks,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-24 transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <span className="text-xl font-semibold">Tasks</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isExpanded && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <form onSubmit={handleSubmit} className="flex gap-2 flex-1">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
              >
                <Plus size={20} />
              </button>
            </form>
            {tasks.length > 0 && (
              <button
                type="button"
                onClick={onClearTasks}
                className="ml-2 p-2 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>

          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <button
                  onClick={() => onToggleTask(task.id)}
                  className={`p-1 rounded-full transition-colors ${
                    task.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  <Check size={16} />
                </button>
                <span
                  className={`flex-1 ${
                    task.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {task.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};