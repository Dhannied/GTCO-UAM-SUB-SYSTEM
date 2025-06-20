export interface Employee {
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
  platform?: string;
  accessLevel?: string;
  lastUsed?: string;
  icon?: string;
  iconBg?: string;
  status: 'Active' | 'Inactive';
  deactivationType?: 'Temporary' | 'Permanent';
}