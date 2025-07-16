// src/components/TaskForm.tsx
import React, { useState } from 'react';
import { Task, Subtask } from '../types';

interface TaskFormProps {
  categories: string[];
  selectedDate: string;
  onSubmit: (task: Omit<Task, 'id' | 'completed'>) => void;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  categories,
  selectedDate,
  onSubmit,
  onClose
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false
      }]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && category.trim()) {
      onSubmit({
        title: title.trim(),
        category: category.trim(),
        subtasks,
        date: selectedDate
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Добавить задачу</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Название задачи</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название задачи"
              required
            />
          </div>

          <div className="form-group">
            <label>Категория</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Введите категорию"
              list="categories"
              required
            />
            <datalist id="categories">
              {categories.map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label>Подзадачи</label>
            <div className="subtask-input">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Добавить подзадачу"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              />
              <button type="button" onClick={addSubtask}>+</button>
            </div>
            
            {subtasks.map(subtask => (
              <div key={subtask.id} className="subtask-item">
                <span>{subtask.title}</span>
                <button type="button" onClick={() => removeSubtask(subtask.id)}>
                  ×
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="submit-btn">
            Сохранить задачу
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
