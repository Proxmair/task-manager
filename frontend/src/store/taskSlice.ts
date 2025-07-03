// store/taskSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChecklistItem {
  _id: string;
  message: string;
  completed: boolean;
}

export interface Task {
  _id: string; 
  title: string;
  description: string;
  checklist: ChecklistItem[];
}

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      const newTask = { ...action.payload };
      state.tasks.push(newTask);
    },
    updateTask: (state, action: PayloadAction<{ id: string; data: Omit<Task, '_id'> }>) => {
      const index = state.tasks.findIndex(t => t._id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...action.payload.data, _id: action.payload.id };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t._id !== action.payload);
    },
    addChecklistItem: (state, action: PayloadAction<{ taskId: string; message: string; _id: string }>) => {
      const task = state.tasks.find(t => t._id === action.payload.taskId);
      if (task) {
        task.checklist.push({
          _id: action.payload._id,
          message: action.payload.message,
          completed: false,
        });
      }
    },
    updateChecklistItem: (state, action: PayloadAction<{ taskId: string; itemId: string; updates: Partial<ChecklistItem> }>) => {
      const task = state.tasks.find(t => t._id === action.payload.taskId);
      if (task) {
        const item = task.checklist.find(i => i._id === action.payload.itemId);
        if (item) Object.assign(item, action.payload.updates);
      }
    },
    deleteChecklistItem: (state, action: PayloadAction<{ taskId: string; itemId: string }>) => {
      const task = state.tasks.find(t => t._id === action.payload.taskId);
      if (task) {
        task.checklist = task.checklist.filter(i => i._id !== action.payload.itemId);
      }
    },
  },
});

export const {
  setTasks,  
  addTask,
  updateTask,
  deleteTask,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} = taskSlice.actions;

export default taskSlice.reducer;
