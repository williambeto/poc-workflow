#!/usr/bin/env node
import { Command } from 'commander';
import { addTask, listTasks, doneTask, removeTask } from '../core/store.js';

const program = new Command();

program
  .name('tasks')
  .description('CLI task tracker')
  .version('0.1.0');

program
  .command('add')
  .description('Add a new task')
  .argument('<title>', 'Task title')
  .option('-p, --priority <level>', 'Priority: low, medium, high', 'medium')
  .action((title: string, options) => {
    const task = addTask(title, options.priority);
    console.log(`Added task #${task.id}: "${task.title}" [${task.priority}]`);
  });

program
  .command('list')
  .description('List all tasks')
  .action(() => {
    const tasks = listTasks();
    if (tasks.length === 0) {
      console.log('No tasks found.');
      return;
    }
    tasks.forEach((t) => {
      const mark = t.status === 'done' ? '✓' : ' ';
      console.log(`[${mark}] #${t.id} [${t.priority}] ${t.title}`);
    });
  });

program
  .command('done')
  .description('Mark a task as done')
  .argument('<id>', 'Task ID')
  .action((id: string) => {
    const task = doneTask(parseInt(id, 10));
    if (task) {
      console.log(`Done: #${task.id} "${task.title}"`);
    } else {
      console.error(`Task #${id} not found.`);
      process.exit(1);
    }
  });

program
  .command('remove')
  .description('Remove a task')
  .argument('<id>', 'Task ID')
  .action((id: string) => {
    const removed = removeTask(parseInt(id, 10));
    if (removed) {
      console.log(`Removed task #${id}.`);
    } else {
      console.error(`Task #${id} not found.`);
      process.exit(1);
    }
  });

program.parse();
