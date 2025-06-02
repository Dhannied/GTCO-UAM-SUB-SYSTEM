import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuditLog } from '../models/audit-log.model';

export interface UAMUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  lastActive: string;
  authorizedApps?: string[];  // Make sure this is defined
  applications?: any[];       // Make sure this is defined
  employeeId?: string;
  phone?: string;
  joinDate?: string;
  photo?: string;  // Add the photo property as optional
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private usersSubject = new BehaviorSubject<UAMUser[]>([]);
  
  constructor() {
    // Initialize with mock data
    this.usersSubject.next(this.getMockUsers());
  }
  
  getUsers(): Observable<UAMUser[]> {
    return this.usersSubject.asObservable();
  }
  
  getUserById(id: string): Observable<UAMUser | null> {
    const user = this.usersSubject.value.find(user => user.id === id) || null;
    return of(user);
  }
  
  addUser(user: UAMUser): Observable<UAMUser> {
    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([user, ...currentUsers]);
    console.log('User added to service:', user);
    console.log('Current users in service:', this.usersSubject.value);
    return of(user); // Return an Observable of the user
  }
  
  updateUser(user: UAMUser): Observable<UAMUser> {
    const users = this.usersSubject.value;
    const index = users.findIndex(u => u.id === user.id);
    
    if (index !== -1) {
      users[index] = { ...user };
      this.usersSubject.next([...users]);
      console.log('User updated in service:', user);
    }
    
    return of(user);
  }
  
  getUserAuditLogs(userId: string): Observable<AuditLog[]> {
    // Mock audit logs for the user
    return of(this.getMockAuditLogs(userId));
  }
  
  // Mock data
  private getMockUsers(): UAMUser[] {
    return [
      // Your mock users here
      {
        id: 'UAM-1001',
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'Supervisor',
        status: 'Active',
        department: 'IT',
        lastActive: '2023-05-15 14:30',
        phone: '+234 9013274980',
        joinDate: '2020-03-15',
        authorizedApps: ['Core Banking', 'Finnacle', 'Gap', 'E-Document Manager'],
        employeeId: 'EMP-10045',
        applications: [
          {
            id: 'app1',
            name: 'Core Banking',
            platform: 'Web Application',
            accessLevel: 'Admin',
            lastUsed: '2023-05-14',
            icon: 'university',
            iconBg: '#4CAF50',
            status: 'Active'
          },
          {
            id: 'app2',
            name: 'Finnacle',
            platform: 'Desktop Application',
            accessLevel: 'User',
            lastUsed: '2023-05-10',
            icon: 'chart-line',
            iconBg: '#2196F3',
            status: 'Active'
          }
        ]
      },
      {
        id: 'UAM-1002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 'Officer',
        status: 'Active',
        department: 'Security',
        lastActive: '2023-05-14 09:45',
        authorizedApps: ['Core Banking', 'E-Document Manager'],
        employeeId: 'EMP-10046',
        applications: [
          {
            id: 'app1',
            name: 'Core Banking',
            platform: 'Web Application',
            accessLevel: 'User',
            lastUsed: '2023-05-13',
            icon: 'university',
            iconBg: '#4CAF50',
            status: 'Active'
          }
        ]
      }
    ];
  }
  
  private getMockAuditLogs(userId: string): AuditLog[] {
    // Return different mock logs based on user ID
    if (userId === 'UAM-1001') {
      return [
        {
          id: 'log-js-1',
          date: '15 May 2023, 14:30',
          employee: 'John Smith',
          employeeId: 'UAM-1001',
          application: 'Core Banking',
          actionType: 'Temporary',
          duration: '30 days',
          reason: 'Suspicious activity detected',
          officer: 'Admin User',
          expirationDate: '14 Jun 2023'
        },
        {
          id: 'log-js-2',
          date: '10 Apr 2023, 09:15',
          employee: 'John Smith',
          employeeId: 'UAM-1001',
          application: 'Finnacle',
          actionType: 'Reactivation',
          reason: 'Issue resolved',
          officer: 'Admin User'
        },
        {
          id: 'log-js-3',
          date: '05 Apr 2023, 11:30',
          employee: 'John Smith',
          employeeId: 'UAM-1001',
          application: 'Finnacle',
          actionType: 'Permanent',
          reason: 'Security policy violation',
          officer: 'Security Officer'
        }
      ];
    } else if (userId === 'UAM-1002') {
      return [
        {
          id: 'log-sj-1',
          date: '12 May 2023, 10:45',
          employee: 'Sarah Johnson',
          employeeId: 'UAM-1002',
          application: 'E-Document Manager',
          actionType: 'Temporary',
          duration: '14 days',
          reason: 'Scheduled maintenance',
          officer: 'System Admin',
          expirationDate: '26 May 2023'
        },
        {
          id: 'log-sj-2',
          date: '20 Mar 2023, 16:20',
          employee: 'Sarah Johnson',
          employeeId: 'UAM-1002',
          application: 'Core Banking',
          actionType: 'Temporary',
          duration: '7 days',
          reason: 'Unusual login pattern',
          officer: 'Security Team',
          expirationDate: '27 Mar 2023'
        },
        {
          id: 'log-sj-3',
          date: '27 Mar 2023, 09:00',
          employee: 'Sarah Johnson',
          employeeId: 'UAM-1002',
          application: 'Core Banking',
          actionType: 'Reactivation',
          reason: 'Temporary deactivation period ended',
          officer: 'System Admin'
        }
      ];
    } else {
      return [];
    }
  }
}






