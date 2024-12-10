/**
 * A task list component with drag-and-drop reordering capability.
 * Features include:
 * - Add, edit, and delete tasks
 * - Mark tasks as complete
 * - Drag-and-drop reordering
 * - Smooth animations for task removal
 * - Responsive design with Catppuccin theme
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Plus, Trash2, Pencil, GripVertical } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onClearTasks: () => void;
  onUpdateTask?: (id: string, text: string) => void;
  onDeleteTask?: (id: string) => void;
  onReorderTasks?: (tasks: Task[]) => void;
}

interface SortableTaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  editingTask: { id: string; text: string } | null;
  removingTaskId: string | null;
}

const SortableTaskItem = ({ task, onToggle, onEdit, onDelete, editingTask, removingTaskId }: SortableTaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      data-task-id={task.id}
      className={`task-item flex items-center gap-2 p-3 rounded-lg bg-black/5 dark:bg-[var(--mocha-base)] hover:bg-black/10 dark:hover:bg-[var(--mocha-mantle)] transition-colors ${
        removingTaskId === task.id ? 'animate-fadeOut' : ''
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab active:cursor-grabbing text-black/40 dark:text-[var(--mocha-subtext1)] hover:text-black/60 dark:hover:text-[var(--mocha-text)] transition-colors"
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
          </div>
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
          </div>
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
          </div>
        </div>
      </button>
      <button
        onClick={() => onToggle(task.id)}
        className={`p-1 rounded-full transition-colors ${
          task.completed
            ? 'bg-[var(--latte-mauve)] dark:bg-[var(--mocha-green)] text-white dark:text-[var(--mocha-base)]'
            : 'bg-black/10 dark:bg-[var(--mocha-mantle)] text-black/40 dark:text-[var(--mocha-subtext1)] hover:bg-black/20 dark:hover:bg-[var(--mocha-surface1)]'
        }`}
      >
        <Check size={16} />
      </button>
      {editingTask?.id === task.id ? (
        <input
          type="text"
          value={editingTask.text}
          onChange={(e) => onEdit(task.id, e.target.value)}
          className="flex-1 px-2 py-1 bg-transparent border-b border-black/20 dark:border-[var(--mocha-surface1)] focus:outline-none focus:border-[var(--latte-mauve)] dark:focus:border-[var(--mocha-mauve)]"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 ${
            task.completed ? 'line-through text-black/40 dark:text-[var(--mocha-subtext1)]' : ''
          }`}
        >
          {task.text}
        </span>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task.id, task.text)}
          className="p-1 text-black/40 dark:text-[var(--mocha-subtext1)] hover:text-[var(--latte-blue)] dark:hover:text-[var(--mocha-blue)] transition-colors"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-black/40 dark:text-[var(--mocha-subtext1)] hover:text-[var(--latte-red)] dark:hover:text-[var(--mocha-red)] transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onClearTasks,
  onUpdateTask,
  onDeleteTask,
  onReorderTasks,
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
      if (onDeleteTask) {
        onDeleteTask(id);
      }
      setRemovingTaskId(null);
    }, 500);
  };

  const handleEditTask = (id: string, text: string) => {
    if (editingTask?.id === id) {
      if (onUpdateTask && editingTask.text.trim()) {
        onUpdateTask(id, editingTask.text);
      }
      setEditingTask(null);
    } else {
      setEditingTask({ id, text });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      
      const newTasks = [...tasks];
      const [movedTask] = newTasks.splice(oldIndex, 1);
      newTasks.splice(newIndex, 0, movedTask);
      
      if (onReorderTasks) {
        onReorderTasks(newTasks);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-24">
      <div className="relative">
        <div className="relative bg-white/80 dark:bg-[var(--mocha-surface0)] backdrop-blur-sm rounded-lg shadow-lg">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 rounded-lg transition-all hover:bg-black/5 dark:hover:bg-[var(--mocha-surface1)]"
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
                    className="flex-1 px-4 py-2 rounded-lg bg-black/5 dark:bg-[var(--mocha-base)] focus:outline-none focus:ring-2 focus:ring-[var(--latte-mauve)] dark:focus:ring-[var(--mocha-mauve)] placeholder-black/40 dark:placeholder-[var(--mocha-subtext1)]"
                  />
                  <button
                    type="submit"
                    disabled={!newTask.trim()}
                    className={`p-2 rounded-lg ${
                      newTask.trim()
                        ? 'bg-[var(--latte-mauve)] dark:bg-[var(--mocha-green)] text-white dark:text-[var(--mocha-base)] hover:opacity-90'
                        : 'bg-black/10 dark:bg-[var(--mocha-mantle)] text-black/20 dark:text-[var(--mocha-subtext1)] cursor-not-allowed'
                    } transition-colors`}
                  >
                    <Plus size={20} />
                  </button>
                </form>
              </div>

              <div className="transition-[height] duration-200 ease-in-out">
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={tasks}
                    strategy={verticalListSortingStrategy}
                  >
                    <ul className="space-y-2">
                      {tasks.map((task) => (
                        <SortableTaskItem
                          key={task.id}
                          task={task}
                          onToggle={onToggleTask}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                          editingTask={editingTask}
                          removingTaskId={removingTaskId}
                        />
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>
              </div>
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
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white/90 dark:bg-[var(--mocha-surface0)] backdrop-blur-sm p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium mb-4">
              Clear all tasks?
            </Dialog.Title>
            <Dialog.Description className="mb-4 text-black/60 dark:text-[var(--mocha-subtext1)]">
              Are you sure you want to delete all tasks? This action cannot be undone.
            </Dialog.Description>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-[var(--mocha-base)] dark:hover:bg-[var(--mocha-mantle)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearTasks}
                className="px-4 py-2 rounded-lg bg-[var(--latte-red)] hover:bg-[var(--latte-maroon)] dark:bg-[var(--mocha-red)] dark:hover:bg-[var(--mocha-maroon)] text-white transition-colors"
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