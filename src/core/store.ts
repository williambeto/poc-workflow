import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { Task, TaskStore } from '../types/task.js';

const DATA_FILE = join(process.cwd(), 'data', 'tasks.json');

function loadStore(): TaskStore {
  if (!existsSync(DATA_FILE)) {
    return { tasks: [], nextId: 1 };
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as TaskStore;
}

function saveStore(store: TaskStore): void {
  const dir = DATA_FILE.replace(/[/\\][^/\\]+$/, '');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

export function addTask(title: string, priority: string = 'medium'): Task {
  const store = loadStore();
  const task: Task = {
    id: store.nextId,
    title,
    priority: priority as Task['priority'],
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  store.tasks.push(task);
  store.nextId++;
  saveStore(store);
  return task;
}

export function listTasks(): Task[] {
  return loadStore().tasks;
}

export function doneTask(id: number): Task | null {
  const store = loadStore();
  const task = store.tasks.find((t) => t.id === id);
  if (!task) return null;
  task.status = 'done';
  task.completedAt = new Date().toISOString();
  saveStore(store);
  return task;
}

export function removeTask(id: number): boolean {
  const store = loadStore();
  const idx = store.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  store.tasks.splice(idx, 1);
  saveStore(store);
  return true;
}
