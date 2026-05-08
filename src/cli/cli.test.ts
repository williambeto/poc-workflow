import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { spawnSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

const CLI = join(process.cwd(), 'dist', 'cli', 'index.js');
const DATA_DIR = join(process.cwd(), 'data');

function runCli(args: string[]): { stdout: string; stderr: string; status: number } {
  const result = spawnSync('node', [CLI, ...args], {
    cwd: process.cwd(),
    encoding: 'utf-8',
  });
  return {
    stdout: result.stdout?.trim() ?? '',
    stderr: result.stderr?.trim() ?? '',
    status: result.status ?? 1,
  };
}

function resetData() {
  if (existsSync(DATA_DIR)) {
    rmSync(DATA_DIR, { recursive: true });
  }
}

describe('CLI list command integration', () => {
  beforeEach(() => { resetData(); });
  afterEach(() => { resetData(); });

  it('displays "No tasks found." when store is empty (AC-01)', () => {
    const result = runCli(['list']);
    expect(result.stdout).toBe('No tasks found.');
    expect(result.status).toBe(0);
  });

  it('displays tasks sorted by priority high > medium > low (AC-02)', () => {
    runCli(['add', 'Low task', '--priority', 'low']);
    runCli(['add', 'High task', '--priority', 'high']);
    runCli(['add', 'Med task', '--priority', 'medium']);

    const result = runCli(['list']);
    const lines = result.stdout.split('\n');

    expect(lines[0]).toContain('[high]');
    expect(lines[1]).toContain('[medium]');
    expect(lines[2]).toContain('[low]');
  });

  it('displays formatted output with priority and marker (AC-06, AC-07)', () => {
    runCli(['add', 'Pending high task', '--priority', 'high']);
    runCli(['done', '1']);

    const result = runCli(['list']);
    const line = result.stdout.split('\n')[0];
    expect(line).toContain('[✓]');
    expect(line).toContain('[high]');
    expect(line).toContain('Pending high task');
  });

  it('--sort asc reverses priority order (AC-05)', () => {
    runCli(['add', 'High', '--priority', 'high']);
    runCli(['add', 'Low', '--priority', 'low']);

    const result = runCli(['list', '--sort', 'asc']);
    const lines = result.stdout.split('\n');
    expect(lines[0]).toContain('[low]');
    expect(lines[1]).toContain('[high]');
  });

  it('--sort ASC is case-insensitive (AC-11)', () => {
    runCli(['add', 'High', '--priority', 'high']);
    runCli(['add', 'Low', '--priority', 'low']);

    const resultAsc = runCli(['list', '--sort', 'asc']);
    const resultASC = runCli(['list', '--sort', 'ASC']);

    expect(resultASC.stdout).toBe(resultAsc.stdout);
  });

  it('--sort INVALID falls back to default without error (AC-10)', () => {
    runCli(['add', 'High', '--priority', 'high']);
    runCli(['add', 'Low', '--priority', 'low']);

    const result = runCli(['list', '--sort', 'INVALID']);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('[high]');
  });

  it('--sort desc equals default sort (AC-08)', () => {
    runCli(['add', 'High', '--priority', 'high']);
    runCli(['add', 'Low', '--priority', 'low']);

    const defaultOut = runCli(['list']).stdout;
    const descOut = runCli(['list', '--sort', 'desc']).stdout;

    expect(descOut).toBe(defaultOut);
  });
});
