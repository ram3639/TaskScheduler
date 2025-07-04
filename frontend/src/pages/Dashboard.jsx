import React, { useEffect, useState } from 'react';
import api from '../api';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async (data) => {
    try {
      await api.post('/tasks', data);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleUpdate = async (data) => {
    try {
      await api.put(`/tasks/${editTask._id}`, data);
      setEditTask(null);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (task) => {
    try {
      await api.delete(`/tasks/${task._id}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await api.patch(`/tasks/${task._id}/complete`);
      fetchTasks();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  return (
    <div className="container dashboard-container">
      <h2 className="dashboard-title">Task Dashboard</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {showForm && (
        <div className="modal">
          <div className="modal-content modal-content-centered">
            <TaskForm
              initial={editTask || {}}
              onSubmit={editTask ? handleUpdate : handleAdd}
              onCancel={() => { setShowForm(false); setEditTask(null); }}
            />
          </div>
        </div>
      )}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="task-grid">
          {tasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
              className={`task-item${task.isCompleted ? ' completed' : ''}`}
            />
          ))}
        </div>
      )}
      <button className="fab" onClick={() => { setShowForm(true); setEditTask(null); }} title="Add Task">+</button>
    </div>
  );
};

export default Dashboard; 