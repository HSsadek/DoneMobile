export type Project = {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  teamMembers: TeamMember[];
  tasks: Task[];
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
};

export type Task = {
  id: string;
  title: string;
  assignee: string | null;
  dueDate: Date;
  startDate: Date;
}; 