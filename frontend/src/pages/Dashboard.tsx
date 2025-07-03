import React, { useState, useEffect } from 'react';
import ChecklistModal from '../components/ChecklistModal';
import TaskModal from '../components/TaskModal';
import TaskCard from '../components/TaskCard';
import { axiosInstance } from '../api/axiosInstance';
import { addChecklistItem, addTask, deleteChecklistItem, deleteTask, setTasks, updateChecklistItem, updateTask } from '../store/taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/index';

interface ChecklistItem {
  _id: string;
  message: string;
  completed: boolean;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  checklist: ChecklistItem[];
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state: RootState) => state.task.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingChecklist, setEditingChecklist] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get('/tasks');
        dispatch(setTasks(res.data.tasks));
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (taskData: Omit<Task, '_id'>) => {
    const res = await axiosInstance.post('/tasks', taskData);
    dispatch(addTask(res.data.task));
  };

  const handleUpdateTask = async (taskId: string, taskData: Omit<Task, '_id'>) => {
    await axiosInstance.put(`/tasks/${taskId}`, taskData);
    dispatch(updateTask({ id: taskId, data: taskData }));
  };

  const handleDeleteTask = async (taskId: string) => {
    await axiosInstance.delete(`/tasks/${taskId}`);
    dispatch(deleteTask(taskId));
  };

  const handleAddChecklistItem = async (taskId: string, message: string) => {
    const res = await axiosInstance.post(`/tasks/${taskId}/checklist`, { message });
    dispatch(addChecklistItem({ taskId, message: res.data.item.message, _id: res.data.item._id }));
  };

  const handleUpdateChecklistItem = async (
    taskId: string,
    itemId: string,
    updates: Partial<ChecklistItem>
  ) => {
    await axiosInstance.put(`/tasks/${taskId}/checklist/${itemId}`, updates);
    dispatch(updateChecklistItem({ taskId, itemId, updates }));
  };

  const handleDeleteChecklistItem = async (taskId: string, itemId: string) => {
    await axiosInstance.delete(`/tasks/${taskId}/checklist/${itemId}`);
    dispatch(deleteChecklistItem({ taskId, itemId }));
  };

  const handleLogout = async () => {
    await axiosInstance.post('/auth/logout');
    navigate('/login');
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

          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium ml-2"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 sm:gap-8">
          {tasks.map(task => (
            <div key={task._id}>
              <TaskCard
                task={task}
                onEdit={() => openModal(task)}
                onDelete={() => handleDeleteTask(task._id)}
                onUpdateChecklist={(itemId, updates) => handleUpdateChecklistItem(task._id, itemId, updates)}
                onDeleteChecklist={(itemId) => handleDeleteChecklistItem(task._id, itemId)}
                onAddChecklist={(message) => handleAddChecklistItem(task._id, message)}
                onEditChecklist={(item) => setEditingChecklist({ taskId: task._id, item })}
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
              handleUpdateTask(editingTask._id, taskData);
            } else {
              handleAddTask(taskData);
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
            handleUpdateChecklistItem(editingChecklist.taskId, editingChecklist.item._id, { message });
            setEditingChecklist(null);
          }}
          onClose={() => setEditingChecklist(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;