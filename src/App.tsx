// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Task, Template, AppState } from './types';
import { StorageUtils } from './utils/storage';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TemplateForm from './components/TemplateForm';
import Calendar from './components/Calendar';
import FloatingButton from './components/FloatingButton';
import './styles/global.css';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    tasks: [],
    templates: [],
    categories: [],
    selectedDate: new Date().toISOString().split('T')[0]
  });

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const tasks = StorageUtils.getTasks();
    const templates = StorageUtils.getTemplates();
    const categories = StorageUtils.getCategories();
    
    setState(prev => ({
      ...prev,
      tasks,
      templates,
      categories
    }));
  }, []);

  const addTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
      subtasks: taskData.subtasks.map(st => ({ ...st, completed: false }))
    };

    const updatedTasks = [...state.tasks, newTask];
    setState(prev => ({ ...prev, tasks: updatedTasks }));
    StorageUtils.saveTasks(updatedTasks);

    if (!state.categories.includes(taskData.category)) {
      const updatedCategories = [...state.categories, taskData.category];
      setState(prev => ({ ...prev, categories: updatedCategories }));
      StorageUtils.saveCategories(updatedCategories);
    }
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = state.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setState(prev => ({ ...prev, tasks: updatedTasks }));
    StorageUtils.saveTasks(updatedTasks);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const updatedTasks = state.tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            )
          }
        : task
    );
    setState(prev => ({ ...prev, tasks: updatedTasks }));
    StorageUtils.saveTasks(updatedTasks);
  };

  const addTemplate = (templateData: Omit<Template, 'id'>) => {
    const newTemplate: Template = {
      ...templateData,
      id: Date.now().toString()
    };

    const updatedTemplates = [...state.templates, newTemplate];
    setState(prev => ({ ...prev, templates: updatedTemplates }));
    StorageUtils.saveTemplates(updatedTemplates);
  };

  const applyTemplate = (templateId: string) => {
    const template = state.templates.find(t => t.id === templateId);
    if (!template) return;

    const tasksFromTemplate = template.tasks.map(taskData => ({
      ...taskData,
      id: Date.now().toString() + Math.random().toString(),
      completed: false,
      date: state.selectedDate,
      subtasks: taskData.subtasks.map(st => ({ ...st, completed: false }))
    }));

    const updatedTasks = [...state.tasks, ...tasksFromTemplate];
    setState(prev => ({ ...prev, tasks: updatedTasks }));
    StorageUtils.saveTasks(updatedTasks);
  };

  const todayTasks = state.tasks.filter(task => task.date === state.selectedDate);
  const groupedTasks = todayTasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="app">
      <header className="header">
        <h1 className="date-title">
          {new Date(state.selectedDate).toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h1>
        <button 
          className="calendar-btn"
          onClick={() => setShowCalendar(true)}
        >
          📅
        </button>
      </header>

      <main className="main">
        <TaskList
          groupedTasks={groupedTasks}
          templates={state.templates}
          onToggleTask={toggleTask}
          onToggleSubtask={toggleSubtask}
          onApplyTemplate={applyTemplate}
          hasTasksToday={todayTasks.length > 0}
        />
      </main>

      <FloatingButton
        showMenu={showMenu}
        onToggleMenu={setShowMenu}
        onAddTask={() => {
          setShowTaskForm(true);
          setShowMenu(false);
        }}
        onCreateTemplate={() => {
          setShowTemplateForm(true);
          setShowMenu(false);
        }}
      />

      {showTaskForm && (
        <TaskForm
          categories={state.categories}
          selectedDate={state.selectedDate}
          onSubmit={addTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}

      {showTemplateForm && (
        <TemplateForm
          categories={state.categories}
          onSubmit={addTemplate}
          onClose={() => setShowTemplateForm(false)}
        />
      )}

      {showCalendar && (
        <Calendar
          selectedDate={state.selectedDate}
          onDateSelect={(date) => {
            setState(prev => ({ ...prev, selectedDate: date }));
            setShowCalendar(false);
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
};

export default App;
