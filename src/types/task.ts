export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'done';

export interface Task {
  id: number;
  title: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  completedAt?: string;
}

export interface TaskStore {
  tasks: Task[];
  nextId: number;
}
