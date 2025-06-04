export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  lastActive?: Date;
}