// src/components/TaskList.tsx
import React from 'react';
import { Task, Template } from '../types';

interface TaskListProps {
  groupedTasks: Record<string, Task[]>;
  templates: Template[];
  onToggleTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onApplyTemplate: (templateId: string) => void;
  hasTasksToday: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  groupedTasks,
  templates,
  onToggleTask,
  onToggleSubtask,
  onApplyTemplate,
  hasTasksToday
}) => {
  if (!hasTasksToday && templates.length > 0) {
    return (
      <div className="templates-section">
        <h2>Шаблоны дней</h2>
        <div className="templates-grid">
          {templates.map(template => (
            <button
              key={template.id}
              className="template-card"
              onClick={() => onApplyTemplate(template.id)}
            >
              <h3>{template.name}</h3>
              <p>{template.tasks.length} задач</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      {Object.entries(groupedTasks).map(([category, tasks]) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          {tasks.map(task => (
            <div key={task.id} className="task-item">
              <label className="task-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id)}
                  className="task-checkbox"
                />
                <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                  {task.title}
                </span>
              </label>
              
              {task.subtasks.length > 0 && (
                <div className="subtasks">
                  {task.subtasks.map(subtask => (
                    <label key={subtask.id} className="subtask-label">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => onToggleSubtask(task.id, subtask.id)}
                        className="subtask-checkbox"
                      />
                      <span className={`subtask-text ${subtask.completed ? 'completed' : ''}`}>
                        {subtask.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
