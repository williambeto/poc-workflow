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

const PRIORITY_WEIGHT: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const STATUS_WEIGHT: Record<string, number> = {
  pending: 1,
  done: 0,
};

export function sortTasks(tasks: Task[], direction: 'asc' | 'desc' = 'desc'): Task[] {
  const mult = direction === 'asc' ? 1 : -1;
  return [...tasks].sort((a, b) => {
    const pa = PRIORITY_WEIGHT[a.priority] ?? 2;
    const pb = PRIORITY_WEIGHT[b.priority] ?? 2;
    if (pa !== pb) return (pa - pb) * mult;
    const sa = STATUS_WEIGHT[a.status] ?? 1;
    const sb = STATUS_WEIGHT[b.status] ?? 1;
    if (sa !== sb) return (sa - sb) * mult;
    return a.id - b.id; // tiebreaker: always ascending by id
  });
}

export function listTasks(direction: 'asc' | 'desc' = 'desc'): Task[] {
  return sortTasks(loadStore().tasks, direction);
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
