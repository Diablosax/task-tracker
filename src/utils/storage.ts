// src/utils/storage.ts
import { Task, Template } from '../types';

const STORAGE_KEYS = {
  TASKS: 'tasks',
  TEMPLATES: 'templates',
  CATEGORIES: 'categories'
};

export const StorageUtils = {
  getTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },

  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getTemplates: (): Template[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return data ? JSON.parse(data) : [];
  },

  saveTemplates: (templates: Template[]): void => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  },

  getCategories: (): string[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  },

  saveCategories: (categories: string[]): void => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }
};
