import { describe, it, expect, beforeEach } from '@jest/globals';
import { addTask, listTasks, doneTask, removeTask } from './store.js';
import { existsSync, readFileSync, writeFileSync, rmSync } from 'fs';
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
    const tasks = listTasks();
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
    expect(listTasks()).toHaveLength(0);
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
