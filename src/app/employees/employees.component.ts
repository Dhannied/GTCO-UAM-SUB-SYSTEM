import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

interface Employee {
  id: string;
  name: string;
  photo: string;
  department: string;
  position: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastActive: string;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  // Add Math object to make it available in the template
  Math = Math;
  
  searchTerm: string = '';
  selectedDepartment: string = 'All Departments';
  selectedStatus: string = 'All Statuses';
  
  employees: Employee[] = [
    {
      id: 'GTB-001',
      name: 'Olivia Rhye',
      photo: '',
      department: 'Finance',
      position: 'Account Manager',
      status: 'Active',
      lastActive: '2025-06-15 09:42'
    },
    {
      id: 'GTB-002',
      name: 'Phoenix Baker',
      photo: '',
      department: 'HR',
      position: 'Account manager',
      status: 'Active',
      lastActive: '2025-06-15 09:42'
    },
    {
      id: 'GTB-003',
      name: 'Lana Steiner',
      photo: '',
      department: 'IT',
      position: 'HR manager',
      status: 'Inactive',
      lastActive: '2025-06-15 09:42'
    },
    {
      id: 'GTB-004',
      name: 'Demi Wilkinson',
      photo: '',
      department: 'Operations',
      position: 'Operations Manager',
      status: 'Pending',
      lastActive: '2025-06-15 09:42'
    },
    {
      id: 'GTB-005',
      name: 'Candice Wu',
      photo: '',
      department: 'Finance',
      position: 'Financial Analyst',
      status: 'Active',
      lastActive: '2025-06-15 09:42'
    },
    {
      id: 'GTB-006',
      name: 'Natali Craig',
      photo: '',
      department: 'HR',
      position: 'HR manager',
      status: 'Pending',
      lastActive: '2025-06-15 09:42'
    },
    {
      id: 'GTB-007',
      name: 'Drew Cano',
      photo: '',
      department: 'Finance',
      position: 'Teller manager',
      status: 'Inactive',
      lastActive: '2025-06-15 09:42'
    }
  ];

  departments = ['All Departments', 'Finance', 'HR', 'IT', 'Operations'];
  statuses = ['All Statuses', 'Active', 'Inactive', 'Pending'];
  
  // Pagination settings
  currentPage = 1;
  itemsPerPage = 8; // Changed to show 8 employees per page
  
  constructor(private router: Router) {}
  
  get filteredEmployees() {
    return this.employees.filter(employee => {
      // Filter by search term
      const matchesSearch = this.searchTerm === '' || 
        employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filter by department
      const matchesDepartment = this.selectedDepartment === 'All Departments' || 
        employee.department === this.selectedDepartment;
      
      // Filter by status
      const matchesStatus = this.selectedStatus === 'All Statuses' || 
        employee.status === this.selectedStatus;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }
  
  get paginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }
  
  getInitials(name: string): string {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  viewEmployee(id: string) {
    this.router.navigate(['/employee', id]);
  }

  clearSearch(): void {
    this.searchTerm = '';
  }
}










