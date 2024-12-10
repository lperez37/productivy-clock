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
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Pencil, Trash2, GripVertical, Plus } from 'lucide-react';
import { Task } from '../types';
import { Dialog } from '@headlessui/react';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onClearTasks: () => void;
  onUpdateTask: (id: string, text: string) => void;
  onDeleteTask: (id: string) => void;
  onReorderTasks: (tasks: Task[]) => void;
}

interface EditingTask {
  id: string;
  text: string;
}

interface SortableTaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  editingTask?: EditingTask;
  removingTaskId?: string;
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
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 p-3 bg-black/5 dark:bg-[var(--mocha-surface0)] rounded-lg ${
        removingTaskId === task.id ? 'animate-fadeOut' : ''
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-black/20 dark:text-[var(--mocha-subtext0)] hover:text-black/40 dark:hover:text-[var(--mocha-subtext1)] transition-colors cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={14} />
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
    </div>
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
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTask, setEditingTask] = useState<EditingTask>();
  const [removingTaskId, setRemovingTaskId] = useState<string>();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showUncheckConfirm, setShowUncheckConfirm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      onReorderTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  const handleEditTask = (id: string, text: string) => {
    if (editingTask?.id === id) {
      onUpdateTask(id, text);
      setEditingTask(undefined);
    } else {
      setEditingTask({ id, text });
    }
  };

  const handleDeleteTask = (id: string) => {
    setRemovingTaskId(id);
    setTimeout(() => {
      onDeleteTask(id);
      setRemovingTaskId(undefined);
    }, 500);
  };

  const handleUncheckAll = () => {
    tasks.forEach(task => {
      if (task.completed) {
        onToggleTask(task.id);
      }
    });
    setShowUncheckConfirm(false);
  };

  const hasCompletedTasks = tasks.some(task => task.completed);

  return (
    <div className="w-full max-w-md mx-auto mt-24">
      <form onSubmit={handleAddTask} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 rounded-lg bg-black/5 dark:bg-[var(--mocha-surface0)] placeholder-black/40 dark:placeholder-[var(--mocha-subtext0)] focus:outline-none focus:ring-2 focus:ring-[var(--latte-mauve)] dark:focus:ring-[var(--mocha-mauve)]"
        />
        <button
          type="submit"
          disabled={!newTaskText.trim()}
          className={`p-2 rounded-lg ${
            newTaskText.trim()
              ? 'bg-[var(--latte-mauve)] dark:bg-[var(--mocha-mauve)] text-white hover:opacity-90'
              : 'bg-black/10 dark:bg-[var(--mocha-surface0)] text-black/20 dark:text-[var(--mocha-subtext0)] cursor-not-allowed'
          } transition-colors`}
        >
          <Plus size={24} />
        </button>
      </form>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
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
          </div>
        </SortableContext>
      </DndContext>

      {tasks.length > 0 && (
        <div className="flex justify-end gap-4 mt-6">
          {hasCompletedTasks && (
            <button
              onClick={() => setShowUncheckConfirm(true)}
              className="text-xs text-[var(--latte-subtext1)] dark:text-[var(--mocha-subtext1)] hover:text-[var(--latte-text)] dark:hover:text-[var(--mocha-text)] transition-colors"
            >
              Uncheck all
            </button>
          )}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-xs text-[var(--latte-subtext1)] dark:text-[var(--mocha-subtext1)] hover:text-[var(--latte-text)] dark:hover:text-[var(--mocha-text)] transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      <Dialog
        open={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white dark:bg-[var(--mocha-mantle)] p-6">
            <Dialog.Title className="text-lg font-medium">Clear all tasks?</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-[var(--latte-subtext1)] dark:text-[var(--mocha-subtext1)]">
              This action cannot be undone.
            </Dialog.Description>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-sm rounded-lg bg-black/5 hover:bg-black/10 dark:bg-[var(--mocha-surface0)] dark:hover:bg-[var(--mocha-surface1)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearTasks();
                  setShowClearConfirm(false);
                }}
                className="px-3 py-1.5 text-sm rounded-lg bg-[var(--latte-red)] dark:bg-[var(--mocha-red)] text-white transition-colors hover:opacity-90"
              >
                Clear all
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={showUncheckConfirm}
        onClose={() => setShowUncheckConfirm(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white dark:bg-[var(--mocha-mantle)] p-6">
            <Dialog.Title className="text-lg font-medium">Uncheck all tasks?</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-[var(--latte-subtext1)] dark:text-[var(--mocha-subtext1)]">
              This action cannot be undone.
            </Dialog.Description>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowUncheckConfirm(false)}
                className="px-3 py-1.5 text-sm rounded-lg bg-black/5 hover:bg-black/10 dark:bg-[var(--mocha-surface0)] dark:hover:bg-[var(--mocha-surface1)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUncheckAll}
                className="px-3 py-1.5 text-sm rounded-lg bg-[var(--latte-mauve)] dark:bg-[var(--mocha-mauve)] text-white transition-colors hover:opacity-90"
              >
                Uncheck all
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};