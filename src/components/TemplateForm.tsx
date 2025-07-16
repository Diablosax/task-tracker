// src/components/TemplateForm.tsx
import React, { useState } from 'react';
import { Template, Subtask } from '../types';

interface TemplateFormProps {
  categories: string[];
  onSubmit: (template: Omit<Template, 'id'>) => void;
  onClose: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  categories,
  onSubmit,
  onClose
}) => {
  const [name, setName] = useState('');
  const [tasks, setTasks] = useState<Array<{
    title: string;
    category: string;
    subtasks: Subtask[];
  }>>([]);

  const [currentTask, setCurrentTask] = useState({
    title: '',
    category: '',
    subtasks: [] as Subtask[]
  });

  const [newSubtask, setNewSubtask] = useState('');

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setCurrentTask(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, {
          id: Date.now().toString(),
          title: newSubtask.trim(),
          completed: false
        }]
      }));
      setNewSubtask('');
    }
  };

  const removeSubtask = (id: string) => {
    setCurrentTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== id)
    }));
  };

  const addTask = () => {
    if (currentTask.title.trim() && currentTask.category.trim()) {
      setTasks([...tasks, { ...currentTask }]);
      setCurrentTask({ title: '', category: '', subtasks: [] });
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && tasks.length > 0) {
      onSubmit({
        name: name.trim(),
        tasks
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Создать шаблон</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Название шаблона</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название шаблона"
              required
            />
          </div>

          <div className="form-group">
            <label>Добавить задачу</label>
            <input
              type="text"
              value={currentTask.title}
              onChange={(e) => setCurrentTask(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Название задачи"
            />
            <input
              type="text"
              value={currentTask.category}
              onChange={(e) => setCurrentTask(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Категория"
              list="categories"
              style={{ marginTop: '0.5rem' }}
            />
            <datalist id="categories">
              {categories.map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            
            <div className="subtask-input" style={{ marginTop: '0.5rem' }}>
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Добавить подзадачу"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              />
              <button type="button" onClick={addSubtask}>+</button>
            </div>

            {currentTask.subtasks.map(subtask => (
              <div key={subtask.id} className="subtask-item">
                <span>{subtask.title}</span>
                <button type="button" onClick={() => removeSubtask(subtask.id)}>×</button>
              </div>
            ))}

            <button 
              type="button" 
              onClick={addTask}
              style={{ marginTop: '0.5rem', background: '#4CAF50' }}
              className="submit-btn"
              disabled={!currentTask.title.trim() || !currentTask.category.trim()}
            >
              Добавить задачу
            </button>
          </div>

          {tasks.length > 0 && (
            <div className="form-group">
              <label>Задачи в шаблоне:</label>
              {tasks.map((task, index) => (
                <div key={index} className="task-preview">
                  <div className="task-preview-header">
                    <span><strong>{task.category}</strong>: {task.title}</span>
                    <button type="button" onClick={() => removeTask(index)}>×</button>
                  </div>
                  {task.subtasks.map(st => (
                    <div key={st.id} className="subtask-preview">
                      - {st.title}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={!name.trim() || tasks.length === 0}
          >
            Сохранить шаблон
          </button>
        </form>
      </div>
    </div>
  );
};

export default TemplateForm;
