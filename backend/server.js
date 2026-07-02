import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';
import Task from './models/Task.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tasktracker';

app.use(cors());
app.use(express.json());

let useMemoryStore = false;
const memoryTasks = [];

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.warn('MongoDB unavailable, falling back to in-memory storage:', error.message);
    useMemoryStore = true;
  }
};

connectToDatabase();

const normalizeTask = (task) => ({
  ...task,
  dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: useMemoryStore ? 'memory' : 'mongodb' });
});

app.get('/api/tasks', async (_req, res) => {
  try {
    if (useMemoryStore) {
      return res.json(memoryTasks.slice().reverse());
    }

    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { title, description = '', dueDate, status = 'pending' } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Title is required.' });
  }

  try {
    if (useMemoryStore) {
      const task = {
        _id: `${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryTasks.unshift(task);
      return res.status(201).json(task);
    }

    const task = await Task.create({ title: title.trim(), description: description.trim(), dueDate, status });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  const { title, description = '', dueDate, status } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Title is required.' });
  }

  try {
    if (useMemoryStore) {
      const index = memoryTasks.findIndex((task) => task._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      const updatedTask = {
        ...memoryTasks[index],
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        status,
        updatedAt: new Date().toISOString(),
      };
      memoryTasks[index] = updatedTask;
      return res.json(updatedTask);
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title: title.trim(), description: description.trim(), dueDate, status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    if (useMemoryStore) {
      const index = memoryTasks.findIndex((task) => task._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: 'Task not found.' });
      }
      memoryTasks.splice(index, 1);
      return res.status(204).send();
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const startServer = (portNumber = port) => {
  return app.listen(portNumber, () => {
    console.log(`Server listening on http://localhost:${portNumber}`);
  });
};

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMainModule) {
  startServer();
}

export { app, startServer };
