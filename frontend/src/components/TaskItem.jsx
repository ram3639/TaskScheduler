import React from 'react';

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete, className }) => {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const dueTime = task.dueTime;
  let dueString = 'N/A';
  let isOverdue = false;
  if (dueDate) {
    const dateStr = dueDate.toLocaleDateString();
    dueString = dueTime ? `${dateStr} ${dueTime}` : dateStr;
    // Check overdue
    let dueDateTime = new Date(dueDate);
    if (dueTime) {
      const [h, m] = dueTime.split(':');
      dueDateTime.setHours(Number(h), Number(m), 0, 0);
    }
    isOverdue = !task.isCompleted && dueDateTime < new Date();
  }

  return (
    <li className={className}>
      <strong>{task.title}</strong> <br />
      {task.description && <span>{task.description}<br /></span>}
      Due: {dueString} {isOverdue && <span style={{color: 'red', fontWeight: 600}}>(Overdue)</span>}<br />
      Priority: {task.priority} <br />
      Reminder: {task.reminder ? 'Yes' : 'No'} <br />
      Status: {task.isCompleted ? 'Completed' : 'Pending'} <br />
      <button onClick={() => onToggleComplete(task)}>
        {task.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
      </button>
      <button onClick={() => onEdit(task)}>Edit</button>
      <button onClick={() => onDelete(task)}>Delete</button>
    </li>
  );
};

export default TaskItem; 