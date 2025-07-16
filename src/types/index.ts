// src/types/index.ts
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  subtasks: Subtask[];
  completed: boolean;
  date: string;
}

export interface Template {
  id: string;
  name: string;
  tasks: Omit<Task, 'id' | 'date' | 'completed'>[];
}

export interface AppState {
  tasks: Task[];
  templates: Template[];
  categories: string[];
  selectedDate: string;
}
