import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { Task, TaskStore } from '../types/task.js';

const DATA_FILE = join(process.cwd(), 'data', 'tasks.json');

interface LoadResult {
  store: TaskStore;
  parseError: boolean;
}

export function loadStore(): LoadResult {
  if (!existsSync(DATA_FILE)) {
    return { store: { tasks: [], nextId: 1 }, parseError: false };
  }
  try {
    const store = JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as TaskStore;
    return { store, parseError: false };
  } catch {
    return { store: { tasks: [], nextId: 1 }, parseError: true };
  }
}

function saveStore(store: TaskStore): void {
  const dir = DATA_FILE.replace(/[/\\][^/\\]+$/, '');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

function normalizePriority(priority: string = 'medium'): Task['priority'] {
  const normalized = (priority || 'medium').toLowerCase();
  if (normalized === 'low' || normalized === 'medium' || normalized === 'high') {
    return normalized;
  }
  return 'medium';
}

export function addTask(title: string, priority: string = 'medium'): Task {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error('INVALID_TITLE');
  }

  const { store } = loadStore();
  const task: Task = {
    id: store.nextId,
    title: trimmedTitle,
    priority: normalizePriority(priority),
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

export function listTasks(direction: 'asc' | 'desc' = 'desc'): { tasks: Task[]; parseError: boolean } {
  const { store, parseError } = loadStore();
  return { tasks: sortTasks(store.tasks, direction), parseError };
}

export function doneTask(id: number): Task | null {
  const { store } = loadStore();
  const task = store.tasks.find((t) => t.id === id);
  if (!task) return null;
  task.status = 'done';
  task.completedAt = new Date().toISOString();
  saveStore(store);
  return task;
}

export function removeTask(id: number): boolean {
  const { store } = loadStore();
  const idx = store.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  store.tasks.splice(idx, 1);
  saveStore(store);
  return true;
}
