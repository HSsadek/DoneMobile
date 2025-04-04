export type Project = {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  teamMembers: TeamMember[];
  tasks: Task[];
  status: TaskStatus;
  progress: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
};

export type TaskStatus = 'yapilacak' | 'devam' | 'test' | 'tamamlanan';

export type Task = {
  id: string;
  title: string;
  description?: string;
  assignee: string | null;
  dueDate: Date;
  startDate: Date;
  status: TaskStatus;
  progress: number;
};