export interface Employee {
  email: string;
  id: string;
  name: string;
  photo?: string;
  department: string;
  position: string;
  status: 'Active' | 'Inactive';
  lastActive?: string;
  employeeId: string;
  joinDate?: string;
  applications?: Application[];
  selected?: boolean; // For bulk operations
}

export interface Application {
  id?: string;
  name: string;
  email: string;
  platform?: string;
  accessLevel?: string;
  lastUsed?: string;
  icon?: string;
  iconBg?: string;
  status: 'Active' | 'Inactive';
  deactivationType?: 'Temporary' | 'Permanent';
}