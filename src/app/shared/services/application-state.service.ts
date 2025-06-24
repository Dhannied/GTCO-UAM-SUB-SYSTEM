import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

// Define interfaces for our application data
export interface Application {
  id: string;
  name: string;
  email: string;
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
  email: string;
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
  providedIn: 'root',
})
export class ApplicationStateService {
  // Store employees data
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$: Observable<Employee[]> =
    this.employeesSubject.asObservable();

  constructor(private authService: AuthService, private http: HttpClient) {
    // Load initial data from localStorage if available
    this.loadState();
  }

  // Get the current officer name
  getCurrentOfficerName(): string {
    // Try to get the current user from localStorage or other auth mechanism
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        return user.name || 'System User';
      } catch (e) {
        console.error('Error parsing current user:', e);
      }
    }

    // If no user is found, return a default name
    return 'UAM Officer';
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
    return this.employeesSubject.value.find((emp) => emp.id === id);
  }

  // Update a specific employee
  updateEmployee(updatedEmployee: Employee): void {
    const employees = this.employeesSubject.value;
    const index = employees.findIndex((emp) => emp.id === updatedEmployee.id);

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
    const employeeIndex = employees.findIndex((emp) => emp.id === employeeId);

    if (employeeIndex !== -1 && employees[employeeIndex].applications) {
      const appIndex = employees[employeeIndex].applications!.findIndex(
        (app) => app.id === appId
      );

      if (appIndex !== -1) {
        employees[employeeIndex].applications![appIndex].status = status;
        employees[employeeIndex].applications![appIndex].deactivationType =
          deactivationType;

        this.employeesSubject.next([...employees]);
        this.saveState();
      }
    }
  }

  // Add this method after updateApplicationStatus
 deactivateApplication(
  employeeId: string,
  appId: string,
  deactivationType: 'Temporary' | 'Permanent',
  startDate?: string,
  endDate?: string
): Observable<any> {
  const payload = {
    status: 'Inactive',
    deactivationType,
    startDate,
    endDate
  };

  return this.http.patch(`/applications/${appId}/deactivate`, payload);
}


  // Add this method to help with analytics
  getDeactivationStats(): {
    temporary: number;
    permanent: number;
    total: number;
  } {
    const employees = this.employeesSubject.value;
    let temporary = 0;
    let permanent = 0;

    employees.forEach((employee) => {
      if (employee.applications) {
        employee.applications.forEach((app) => {
          if (app.status === 'Inactive') {
            if (app.deactivationType === 'Temporary') {
              temporary++;
            } else if (app.deactivationType === 'Permanent') {
              permanent++;
            }
          }
        });
      }
    });

    return {
      temporary,
      permanent,
      total: temporary + permanent,
    };
  }

  // Add this method to activate applications
  activateApplication(employeeId: string, appId: string): void {
    const employees = this.employeesSubject.value;
    const employeeIndex = employees.findIndex((emp) => emp.id === employeeId);

    if (employeeIndex !== -1 && employees[employeeIndex].applications) {
      const appIndex = employees[employeeIndex].applications!.findIndex(
        (app) => app.id === appId
      );

      if (appIndex !== -1) {
        employees[employeeIndex].applications![appIndex].status = 'Active';
        employees[employeeIndex].applications![appIndex].deactivationType =
          undefined;

        this.employeesSubject.next([...employees]);
        this.saveState();
      }
    }
  }

  // Save state to localStorage
  private saveState(): void {
    localStorage.setItem(
      'appState',
      JSON.stringify({
        employees: this.employeesSubject.value,
      })
    );
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
