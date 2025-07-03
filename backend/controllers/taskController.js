import Task from "../models/Task.js";

// @desc Create a new task
export const createTask = async (req, res) => {
    const { title, description, checklist = [] } = req.body;

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required." });
    }

    try {
        const task = await Task.create({
            title,
            description,
            checklist,
            user: req.user.id,
        });

        res.status(201).json({ message: "Task created", task });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Get all tasks for logged-in user
export const getTasks = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const tasks = await Task.find({ user: req.user._id });
        res.status(200).json({ tasks });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Update a task
export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, checklist } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const task = await Task.findOne({ _id: id, user: req.user._id });

        if (!task) return res.status(404).json({ message: "Task not found" });

        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.checklist = checklist ?? task.checklist;

        await task.save();

        res.status(200).json({ message: "Task updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Delete a task
export const deleteTask = async (req, res) => {
    const { id } = req.params;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        console.log('Deleting task with ID:', id);
        console.log('User ID:', req.user._id);
        const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.status(200).json({ message: "Task deleted" });
    } catch (err) {
        console.log('error deleting task:', err);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Add checklist item
export const addChecklistItem = async (req, res) => {
  const { message } = req.body;
  const { taskId } = req.params;

  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (!message) return res.status(400).json({ message: "Checklist item message is required." });

  try {
    const task = await Task.findOne({ _id: taskId, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const newItem = { message, completed: false };
    task.checklist.push(newItem);
    await task.save();

    const savedItem = task.checklist.at(-1);
    console.log("New checklist item added:", savedItem);
    res.status(201).json({ message: "Checklist item added", item: savedItem });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// @desc Update checklist item
export const updateChecklistItem = async (req, res) => {
    const { taskId, itemId } = req.params;
    const { message, completed } = req.body;

    console.log("Updating checklist item:", { taskId, itemId, message, completed });

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const task = await Task.findOne({ _id: taskId, user: req.user._id });
        if (!task) return res.status(404).json({ message: "Task not found" });

        const item = task.checklist.find((i) => i._id.equals(itemId));
        if (!item) return res.status(404).json({ message: "Checklist item not found" });

        if (message !== undefined) item.message = message;
        if (completed !== undefined) item.completed = completed;

        await task.save();

        res.status(200).json({ message: "Checklist item updated" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Delete checklist item
export const deleteChecklistItem = async (req, res) => {
    const { taskId, itemId } = req.params;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const task = await Task.findOne({ _id: taskId, user: req.user._id });
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.checklist = task.checklist.filter((i) => i.id !== itemId);
        await task.save();

        res.status(200).json({ message: "Checklist item deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
