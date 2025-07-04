import React, { useState } from 'react';

const TaskForm = ({ initial = {}, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [dueDate, setDueDate] = useState(initial.dueDate ? initial.dueDate.slice(0, 10) : '');
  const [dueTime, setDueTime] = useState(initial.dueTime || '');
  const [priority, setPriority] = useState(initial.priority || 'Medium');
  const [reminder, setReminder] = useState(initial.reminder || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, dueDate, dueTime, priority, reminder });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="form-label" htmlFor="task-title">Title</label>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <label className="form-label" htmlFor="task-desc">Description</label>
      <textarea
        id="task-desc"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <label className="form-label" htmlFor="task-date">Due Date</label>
      <input
        id="task-date"
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />
      <label className="form-label" htmlFor="task-time">Due Time</label>
      <input
        id="task-time"
        type="time"
        value={dueTime}
        onChange={e => setDueTime(e.target.value)}
      />
      <label className="form-label" htmlFor="task-priority">Priority</label>
      <select id="task-priority" value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <label className="reminder-toggle">
        <input
          type="checkbox"
          checked={reminder}
          onChange={e => setReminder(e.target.checked)}
        />
        <span className="slider"></span>
        <span className="reminder-label">Reminder</span>
      </label>
      <div className="button-group">
        <button type="submit" className="primary-btn">Save</button>
        {onCancel && <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

export default TaskForm; 