import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Define interfaces for our application data
export interface Application {
  id: string;
  name: string;
  platform: string;
  accessLevel: 'Full Access' | 'Read Only' | 'Write Only';
  lastUsed: string;
  icon: string;
  iconBg: string;
  status?: 'Active' | 'Inactive' | 'Pending';
  deactivationType?: 'Temporary' | 'Permanent';
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  photo?: string;
  applications?: Application[];
  selected?: boolean;
  status?: 'Active' | 'Inactive' | 'Pending';
  lastActive?: string;
  employeeId?: string;
  joinDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationStateService {
  // Store employees data
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$: Observable<Employee[]> = this.employeesSubject.asObservable();
  
  constructor() {
    // Load initial data from localStorage if available
    this.loadState();
  }
  
  // Get all employees
  getEmployees(): Employee[] {
    const employees = this.employeesSubject.value;
    console.log('Getting employees from state service:', employees);
    return employees;
  }
  
  // Set all employees
  setEmployees(employees: Employee[]): void {
    console.log('Setting employees in state service:', employees);
    this.employeesSubject.next(employees);
    this.saveState();
  }
  
  // Get a specific employee by ID
  getEmployeeById(id: string): Employee | undefined {
    return this.employeesSubject.value.find(emp => emp.id === id);
  }
  
  // Update a specific employee
  updateEmployee(updatedEmployee: Employee): void {
    const employees = this.employeesSubject.value;
    const index = employees.findIndex(emp => emp.id === updatedEmployee.id);
    
    if (index !== -1) {
      employees[index] = updatedEmployee;
      this.employeesSubject.next([...employees]);
      this.saveState();
    }
  }
  
  // Restore the original updateApplicationStatus method
  updateApplicationStatus(
    employeeId: string, 
    appId: string, 
    status: 'Active' | 'Inactive' | 'Pending',
    deactivationType?: 'Temporary' | 'Permanent'
  ): void {
    const employees = this.employeesSubject.value;
    const employeeIndex = employees.findIndex(emp => emp.id === employeeId);
    
    if (employeeIndex !== -1 && employees[employeeIndex].applications) {
      const appIndex = employees[employeeIndex].applications!.findIndex(app => app.id === appId);
      
      if (appIndex !== -1) {
        employees[employeeIndex].applications![appIndex].status = status;
        employees[employeeIndex].applications![appIndex].deactivationType = deactivationType;
        
        this.employeesSubject.next([...employees]);
        this.saveState();
      }
    }
  }
  
  // Save state to localStorage
  private saveState(): void {
    localStorage.setItem('appState', JSON.stringify({
      employees: this.employeesSubject.value
    }));
  }
  
  // Load state from localStorage
  private loadState(): void {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.employees) {
          this.employeesSubject.next(state.employees);
        }
      } catch (e) {
        console.error('Error loading application state:', e);
      }
    }
  }
}





