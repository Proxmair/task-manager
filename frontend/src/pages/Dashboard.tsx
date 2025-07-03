import React, { useState } from 'react';

interface ChecklistItem {
  id: string;
  message: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  checklist: ChecklistItem[];
}

export default function App() {
  const [tasks, setTasks] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingChecklist, setEditingChecklist] = useState(null);

  // Task operations
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId: string, taskData: Omit<Task, 'id'>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...taskData, id: taskId } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Checklist operations
  const addChecklistItem = (taskId: string, message: string) => {
    const newItem: ChecklistItem = {
      id: `${taskId}-${Date.now()}`,
      message,
      completed: false
    };
    
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, checklist: [...task.checklist, newItem] }
        : task
    ));
  };

  const updateChecklistItem = (taskId: string, itemId: string, updates: Partial<ChecklistItem>) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            checklist: task.checklist.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        : task
    ));
  };

  const deleteChecklistItem = (taskId: string, itemId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, checklist: task.checklist.filter(item => item.id !== itemId) }
        : task
    ));
  };

  const openModal = (task?: Task) => {
    setEditingTask(task || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">Task Manager</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Add New Task
          </button>
        </div>

        <div className="grid gap-6 sm:gap-8">
          {tasks.map(task => (
            <div key={task.id}>
              <TaskCard
                task={task}
                onEdit={() => openModal(task)}
                onDelete={() => deleteTask(task.id)}
                onUpdateChecklist={(itemId, updates) => updateChecklistItem(task.id, itemId, updates)}
                onDeleteChecklist={(itemId) => deleteChecklistItem(task.id, itemId)}
                onAddChecklist={(message) => addChecklistItem(task.id, message)}
                onEditChecklist={(item) => setEditingChecklist({taskId: task.id, item})}
              />
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No tasks yet. Create your first task!</p>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add Task
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onSave={(taskData) => {
            if (editingTask) {
              updateTask(editingTask.id, taskData);
            } else {
              addTask(taskData);
            }
            closeModal();
          }}
          onClose={closeModal}
        />
      )}

      {editingChecklist && (
        <ChecklistModal
          item={editingChecklist.item}
          onSave={(message) => {
            updateChecklistItem(editingChecklist.taskId, editingChecklist.item.id, { message });
            setEditingChecklist(null);
          }}
          onClose={() => setEditingChecklist(null)}
        />
      )}
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onUpdateChecklist, onDeleteChecklist, onAddChecklist, onEditChecklist }) {
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const completedCount = task.checklist.filter(item => item.completed).length;
  const totalCount = task.checklist.length;

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      onAddChecklist(newChecklistItem.trim());
      setNewChecklistItem('');
      setIsAddingItem(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex-1 mb-4 sm:mb-0">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-medium text-gray-800">Checklist</h4>
          <span className="text-sm text-gray-500">
            {completedCount} of {totalCount} completed
          </span>
        </div>
        
        {totalCount > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        )}

        <div className="space-y-2">
          {task.checklist.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={(e) => onUpdateChecklist(item.id, { completed: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {item.message}
              </span>
              <button
                onClick={() => onEditChecklist(item)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteChecklist(item.id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {isAddingItem ? (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              placeholder="Enter checklist item"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
              autoFocus
            />
            <button
              onClick={handleAddChecklistItem}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingItem(false);
                setNewChecklistItem('');
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingItem(true)}
            className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            + Add Checklist Item
          </button>
        )}
      </div>
    </div>
  );
}

function TaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        checklist: task?.checklist || []
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {task ? 'Edit Task' : 'Add New Task'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter task description"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition-colors"
          >
            {task ? 'Update' : 'Add'} Task
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ChecklistModal({ item, onSave, onClose }) {
  const [message, setMessage] = useState(item.message);

  const handleSave = () => {
    if (message.trim()) {
      onSave(message.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Checklist Item</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter checklist item message"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={!message.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Update Item
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}