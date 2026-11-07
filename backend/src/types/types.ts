export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface Project {
  id: number;
  name: string;
  owner_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  position: number;
  assignee_id: number | null;
  created_at: Date;
  updated_at: Date;
}