import { describe, it, expect, beforeEach } from '@jest/globals';
import { spawnSync } from 'child_process';
import { existsSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const CLI = join(process.cwd(), 'dist', 'cli', 'index.js');
const DATA_DIR = join(process.cwd(), 'data');

function runCli(args: string[]): { stdout: string; stderr: string; status: number } {
  const result = spawnSync('node', [CLI, ...args], {
    encoding: 'utf-8',
    timeout: 5000,
  });
  return {
    stdout: (result.stdout ?? '').trim(),
    stderr: (result.stderr ?? '').trim(),
    status: result.status ?? 1,
  };
}

function addTask(id: number, title: string, priority: string, status: string): void {
  mkdirSync(DATA_DIR, { recursive: true });
  const filePath = join(DATA_DIR, 'tasks.json');
  let store = { tasks: [] as object[], nextId: 1 };
  if (existsSync(filePath)) {
    try { store = JSON.parse(readFileSync(filePath, 'utf-8')) as typeof store; } catch { /* ignore */ }
  }
  store.tasks.push({ id, title, priority, status, createdAt: new Date().toISOString() });
  store.nextId = Math.max(store.nextId, id + 1);
  writeFileSync(filePath, JSON.stringify(store));
}

describe('CLI list command integration', () => {
  beforeEach(() => {
    if (existsSync(DATA_DIR)) rmSync(DATA_DIR, { recursive: true });
  });

  it('displays "No tasks found." when store is empty (AC-01)', () => {
    const result = runCli(['list']);
    expect(result.stdout).toBe('No tasks found.');
    expect(result.status).toBe(0);
  });

  it('displays tasks sorted by priority high > medium > low (AC-02)', () => {
    addTask(1, 'Low task', 'low', 'pending');
    addTask(2, 'High task', 'high', 'pending');
    addTask(3, 'Med task', 'medium', 'pending');

    const result = runCli(['list']);
    const lines = result.stdout.split('\n');
    expect(lines[0]).toContain('[high]');
    expect(lines[1]).toContain('[medium]');
    expect(lines[2]).toContain('[low]');
  });

  it('displays formatted output with priority and marker (AC-06, AC-07)', () => {
    addTask(1, 'Pending high task', 'high', 'pending');

    const addResult = runCli(['done', '1']);
    expect(addResult.status).toBe(0);

    const result = runCli(['list']);
    const line = result.stdout.split('\n')[0];
    expect(line).toContain('[✓]');
    expect(line).toContain('[high]');
    expect(line).toContain('Pending high task');
  });

  it('--sort asc reverses priority order (AC-05)', () => {
    addTask(1, 'High', 'high', 'pending');
    addTask(2, 'Low', 'low', 'pending');

    const result = runCli(['list', '--sort', 'asc']);
    const lines = result.stdout.split('\n');
    expect(lines[0]).toContain('[low]');
    expect(lines[1]).toContain('[high]');
  });

  it('--sort ASC is case-insensitive (AC-11)', () => {
    addTask(1, 'High', 'high', 'pending');
    addTask(2, 'Low', 'low', 'pending');

    const resultAsc = runCli(['list', '--sort', 'asc']);
    const resultASC = runCli(['list', '--sort', 'ASC']);

    expect(resultASC.stdout).toBe(resultAsc.stdout);
  });

  it('--sort INVALID falls back to default without error (AC-10)', () => {
    addTask(1, 'High', 'high', 'pending');
    addTask(2, 'Low', 'low', 'pending');

    const result = runCli(['list', '--sort', 'INVALID']);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('[high]');
  });

  it('--sort desc equals default sort (AC-08)', () => {
    addTask(1, 'High', 'high', 'pending');
    addTask(2, 'Low', 'low', 'pending');

    const defaultOut = runCli(['list']).stdout;
    const descOut = runCli(['list', '--sort', 'desc']).stdout;

    expect(descOut).toBe(defaultOut);
  });
});
