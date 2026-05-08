import { describe, it, expect, beforeEach } from '@jest/globals';
import { addTask, listTasks, doneTask, removeTask, sortTasks } from './store.js';
import { existsSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'tasks.json');

function resetStore() {
  if (existsSync(DATA_FILE)) rmSync(DATA_FILE);
  if (existsSync(join(process.cwd(), 'data'))) rmSync(join(process.cwd(), 'data'), { recursive: true });
}

describe('Task Store', () => {
  beforeEach(() => {
    resetStore();
  });

  it('adds a task', () => {
    const task = addTask('Test task', 'high');
    expect(task.title).toBe('Test task');
    expect(task.priority).toBe('high');
    expect(task.status).toBe('pending');
    expect(task.id).toBe(1);
  });

  it('lists tasks', () => {
    addTask('Task 1', 'low');
    addTask('Task 2', 'high');
    const { tasks } = listTasks();
    expect(tasks).toHaveLength(2);
  });

  it('marks a task as done', () => {
    addTask('Task to complete', 'medium');
    const task = doneTask(1);
    expect(task?.status).toBe('done');
    expect(task?.completedAt).toBeDefined();
  });

  it('removes a task', () => {
    addTask('Task to remove', 'low');
    const removed = removeTask(1);
    expect(removed).toBe(true);
    expect(listTasks().tasks).toHaveLength(0);
  });

  it('returns null for doneTask with invalid id', () => {
    const result = doneTask(999);
    expect(result).toBeNull();
  });

  it('returns false for removeTask with invalid id', () => {
    const result = removeTask(999);
    expect(result).toBe(false);
  });
});

describe('sortTasks', () => {
  const DATA_DIR = join(process.cwd(), 'data');

  function createTask(id: number, priority: string, status: string): void {
    const filePath = join(DATA_DIR, 'tasks.json');
    mkdirSync(DATA_DIR, { recursive: true });
    let store = { tasks: [] as object[], nextId: 1 };
    if (existsSync(filePath)) {
      store = JSON.parse(readFileSync(filePath, 'utf-8')) as typeof store;
    }
    store.tasks.push({
      id,
      title: `Task ${id}`,
      priority,
      status,
      createdAt: new Date().toISOString(),
    });
    store.nextId = Math.max(store.nextId, id + 1);
    writeFileSync(filePath, JSON.stringify(store));
  }

  beforeEach(() => {
    if (existsSync(join(process.cwd(), 'data'))) {
      rmSync(join(process.cwd(), 'data'), { recursive: true });
    }
  });

  it('sorts by priority high > medium > low (AC-02)', () => {
    resetStore();
    createTask(1, 'low', 'pending');
    createTask(2, 'high', 'pending');
    createTask(3, 'medium', 'pending');
    const { tasks } = listTasks();
    expect(tasks[0].priority).toBe('high');
    expect(tasks[1].priority).toBe('medium');
    expect(tasks[2].priority).toBe('low');
  });

  it('pending tasks appear before done tasks (AC-03)', () => {
    resetStore();
    createTask(1, 'high', 'done');
    createTask(2, 'high', 'pending');
    const { tasks } = listTasks();
    expect(tasks[0].status).toBe('pending');
    expect(tasks[1].status).toBe('done');
  });

  it('stable sort by id within same priority and status (AC-04)', () => {
    resetStore();
    createTask(5, 'high', 'pending');
    createTask(2, 'high', 'pending');
    createTask(8, 'high', 'pending');
    const { tasks } = listTasks();
    expect(tasks[0].id).toBe(2);
    expect(tasks[1].id).toBe(5);
    expect(tasks[2].id).toBe(8);
  });

  it('--sort asc reverses priority order (AC-05)', () => {
    resetStore();
    createTask(1, 'high', 'pending');
    createTask(2, 'low', 'pending');
    const { tasks: tasksAsc } = listTasks('asc');
    expect(tasksAsc[0].priority).toBe('low');
    expect(tasksAsc[1].priority).toBe('high');
  });

  it('invalid sort value falls back to desc (AC-10)', () => {
    resetStore();
    createTask(1, 'high', 'pending');
    createTask(2, 'low', 'pending');
    const { tasks: tasksInvalid } = listTasks('invalid' as 'asc' | 'desc');
    expect(tasksInvalid[0].priority).toBe('high');
    expect(tasksInvalid[1].priority).toBe('low');
  });
});
