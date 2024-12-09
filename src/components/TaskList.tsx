
import { Plus, Trash2, Check } from 'lucide-react';
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
  const handleAddTask = () => {
    const text = prompt('Enter task:');
    if (text) onAddTask(text);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <div className="flex gap-2">
          <button
            onClick={handleAddTask}
            className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={onClearTasks}
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors"
          >
            <button
              onClick={() => onToggleTask(task.id)}
              className={`p-1 rounded-full ${
                task.completed
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
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
  );
};
      