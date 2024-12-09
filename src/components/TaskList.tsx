import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Check, Plus, Trash2, Pencil } from 'lucide-react';
import { Dialog } from '@headlessui/react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{ id: string; text: string } | null>(null);
  const [removingTaskId, setRemovingTaskId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask('');
    }
  };

  const handleClearTasks = () => {
    const taskElements = document.querySelectorAll('.task-item');
    taskElements.forEach((el) => {
      (el as HTMLElement).style.animation = 'fadeOut 0.5s forwards';
    });
    setTimeout(() => {
      setIsModalOpen(false);
      onClearTasks();
    }, 500);
  };

  const handleDeleteTask = (id: string) => {
    setRemovingTaskId(id);
    setTimeout(() => {
      const updatedTasks = tasks.filter(task => task.id !== id);
      onClearTasks();
      updatedTasks.forEach(task => onAddTask(task.text));
      setRemovingTaskId(null);
    }, 500);
  };

  const handleEditTask = (id: string, text: string) => {
    if (editingTask?.id === id) {
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, text: editingTask.text } : task
      );
      onClearTasks();
      updatedTasks.forEach(task => onAddTask(task.text));
      setEditingTask(null);
    } else {
      setEditingTask({ id, text });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-24">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 rounded-lg transition-all"
          >
            <span className="text-xl font-semibold">Tasks</span>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {isExpanded && (
            <div className="p-4">
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
                    disabled={!newTask.trim()}
                    className={`p-2 rounded-lg ${
                      newTask.trim()
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-300 cursor-not-allowed'
                    } text-white transition-colors`}
                  >
                    <Plus size={20} />
                  </button>
                </form>
                {tasks.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="ml-2 p-2 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all hover:rotate-180 duration-300"
                  >
                    <RotateCcw size={20} />
                  </button>
                )}
              </div>

              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`task-item flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                      removingTaskId === task.id ? 'animate-fadeOut' : ''
                    }`}
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
                    {editingTask?.id === task.id ? (
                      <input
                        type="text"
                        value={editingTask.text}
                        onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                        className="flex-1 px-2 py-1 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`flex-1 ${
                          task.completed ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {task.text}
                      </span>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTask(task.id, task.text)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium mb-4">
              Clear all tasks?
            </Dialog.Title>
            <Dialog.Description className="mb-4 text-gray-600 dark:text-gray-400">
              Are you sure you want to delete all tasks? This action cannot be undone.
            </Dialog.Description>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearTasks}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                Delete All
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};