import { useEffect, useState } from 'react';

const initialForm = {
  title: '',
  description: '',
  dueDate: '',
  status: 'pending',
};

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Unable to load tasks right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_BASE_URL}/tasks/${editingId}` : `${API_BASE_URL}/tasks`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      resetForm();
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setForm({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      status: task.status || 'pending',
    });
    setError('');
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Unable to delete task.');
      }
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">MERN Stack Assignment</p>
          <h1>Task Tracker</h1>
          <p>Organize work with a responsive task board and instant updates.</p>
        </div>
      </header>

      <main className="content-grid">
        <section className="panel form-panel">
          <h2>{editingId ? 'Update Task' : 'Add a New Task'}</h2>
          <form onSubmit={handleSubmit} className="task-form">
            <label>
              Title
              <input name="title" value={form.title} onChange={handleChange} placeholder="Enter task title" />
            </label>
            <label>
              Description
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Add details" />
            </label>
            <label>
              Due Date
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            {error ? <p className="error">{error}</p> : null}
            <div className="button-row">
              <button type="submit">{editingId ? 'Save Changes' : 'Create Task'}</button>
              {editingId ? <button type="button" className="secondary" onClick={resetForm}>Cancel</button> : null}
            </div>
          </form>
        </section>

        <section className="panel list-panel">
          <div className="panel-header">
            <h2>Your Tasks</h2>
            <span>{tasks.length} task(s)</span>
          </div>

          {loading ? <p>Loading tasks...</p> : tasks.length === 0 ? <p>No tasks yet. Create one to get started.</p> : (
            <div className="task-list">
              {tasks.map((task) => (
                <article className="task-card" key={task._id}>
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description || 'No description provided.'}</p>
                    <p className="meta">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                    <p className="meta">Status: {task.status}</p>
                  </div>
                  <div className="card-actions">
                    <button type="button" onClick={() => startEdit(task)}>Edit</button>
                    <button type="button" className="danger" onClick={() => handleDelete(task._id)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
