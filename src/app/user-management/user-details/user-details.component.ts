import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserManagementService, UAMUser } from '../../shared/services/user-management.service';
import { AuditLog } from '../../shared/models/audit-log.model';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

interface Application {
  id: string;
  name: string;
  platform: string;
  accessLevel: string;
  lastUsed: string;
  icon: string;
  iconBg: string;
  status?: 'Active' | 'Inactive';
  deactivationType?: 'Temporary' | 'Permanent';
}

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent]
})
export class UserDetailsComponent implements OnInit {
  userId: string = '';
  user: UAMUser | null = null;
  userAuditLogs: AuditLog[] = [];
  filteredAuditLogs: AuditLog[] = [];
  auditDateFilter: string = 'all';
  
  // Application properties
  appSearchTerm: string = '';
  selectedTimeFilter: string = 'all';
  userApps: any[] = []; // Add this property to store user applications
  deactivationLogs: AuditLog[] = []; // Add this property to store deactivation logs
  filteredLogs: AuditLog[] = []; // Use the AuditLog type
  filteredApplications: any[] = [];
  
  // Deactivation modal properties
  showDeactivationModal: boolean = false;
  deactivationType: 'Temporary' | 'Permanent' = 'Temporary';
  deactivationReason: string = '';
  deactivationDuration: number = 1;
  durationUnit: 'days' | 'weeks' | 'months' = 'days';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserManagementService
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if (userId) {
        this.userId = userId;
        this.userService.getUserById(userId).subscribe((user: UAMUser | null) => {
          this.user = user;
          if (this.user) {
            console.log('User loaded:', this.user);
            
            // Check if applications array exists, if not, create it from authorizedApps
            if (!this.user.applications || this.user.applications.length === 0) {
              if (this.user.authorizedApps && this.user.authorizedApps.length > 0) {
                this.user.applications = this.createApplicationsFromAuthorizedApps(this.user.authorizedApps);
                // Update the user with the new applications
                this.userService.updateUser(this.user).subscribe();
              }
            }
            
            this.loadUserAuditLogs();
            this.filteredApplications = [...(this.user.applications || [])];
          }
        });
      }
    });
  }
  
  // Navigation method
  goBack(): void {
    this.router.navigate(['/user-management']);
  }

  // Add this method to load user audit logs
  loadUserAuditLogs(): void {
    if (!this.user || !this.userId) {
      return;
    }
    
    this.userService.getUserAuditLogs(this.userId).subscribe((logs: AuditLog[]) => {
      this.userAuditLogs = logs;
      this.filteredLogs = [...this.userAuditLogs]; // Initialize filtered logs
      console.log('Loaded audit logs:', this.userAuditLogs);
    });
  }

  // Filter audit logs based on date filter
  filterAuditLogs(): void {
    if (this.auditDateFilter === 'all') {
      this.filteredAuditLogs = [...this.userAuditLogs];
      return;
    }
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (this.auditDateFilter) {
      case 'today':
        cutoffDate.setHours(0, 0, 0, 0); // Start of today
        break;
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setDate(now.getDate() - 30);
        break;
    }
    
    this.filteredAuditLogs = this.userAuditLogs.filter((log: AuditLog) => {
      const logDate = new Date(log.date);
      return logDate >= cutoffDate;
    });
  }

  // Get expiration date for temporary deactivations
  getExpirationDate(log: AuditLog): string {
    if (log.expirationDate) {
      return log.expirationDate;
    }
    
    if (!log.duration) {
      return 'Unknown';
    }
    
    // Parse the log date
    const logDate = new Date(log.date);
    
    // Extract the number of days from the duration string
    const durationMatch = log.duration.match(/(\d+)/);
    if (!durationMatch) {
      return log.duration; // Return original duration if parsing fails
    }
    
    const days = parseInt(durationMatch[1], 10);
    
    // Calculate expiration date
    const expirationDate = new Date(logDate);
    expirationDate.setDate(logDate.getDate() + days);
    
    // Format the date as DD MMM YYYY
    return expirationDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // Grant access to an application
  grantAccess(appId: string): void {
    if (!this.user || !this.user.applications) {
      return;
    }
    
    // Find the application
    const appIndex = this.user.applications.findIndex(app => app.id === appId);
    if (appIndex !== -1) {
      // Update the application status
      this.user.applications[appIndex].status = 'Active';
      
      // Update filtered applications
      this.filterApplications();
      
      // Create an audit log entry
      const app = this.user.applications[appIndex];
      const auditLog: AuditLog = {
        date: new Date().toLocaleString('en-US', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false
        }),
        employee: this.user.name,
        employeeId: this.userId,
        application: app.name,
        actionType: 'Reactivation',
        reason: 'Access granted by UAM officer',
        officer: 'Current User'
      };
      
      // Add to audit logs
      this.userAuditLogs.unshift(auditLog);
      this.filterAuditLogs();
      
      // Save changes to the user
      this.userService.updateUser(this.user).subscribe();
    }
  }

  // Revoke access to an application
  revokeAccess(appId: string): void {
    if (!this.user || !this.user.applications) {
      return;
    }
    
    // Find the application
    const appIndex = this.user.applications.findIndex(app => app.id === appId);
    if (appIndex !== -1) {
      // Show deactivation modal
      this.showDeactivationModal = true;
      
      // Set the application to be deactivated
      // You would need to add a selectedApp property to the component
      // this.selectedApp = this.user.applications[appIndex];
      
      // For now, let's just deactivate the application
      this.user.applications[appIndex].status = 'Inactive';
      this.user.applications[appIndex].deactivationType = 'Temporary';
      
      // Update filtered applications
      this.filterApplications();
      
      // Create an audit log entry
      const app = this.user.applications[appIndex];
      const auditLog: AuditLog = {
        date: new Date().toLocaleString('en-US', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false
        }),
        employee: this.user.name,
        employeeId: this.userId,
        application: app.name,
        actionType: 'Temporary',
        duration: '30 days',
        reason: 'Access revoked by UAM officer',
        officer: 'Current User'
      };
      
      // Add to audit logs
      this.userAuditLogs.unshift(auditLog);
      this.filterAuditLogs();
      
      // Save changes to the user
      this.userService.updateUser(this.user).subscribe();
    }
  }

  // Filter applications based on search term
  filterApplications(): void {
    if (!this.user || !this.user.applications) {
      this.filteredApplications = [];
      return;
    }
    
    if (!this.appSearchTerm) {
      this.filteredApplications = [...(this.user.applications || [])];
      return;
    }
    
    const searchTerm = this.appSearchTerm.toLowerCase();
    this.filteredApplications = this.user.applications.filter(app => 
      app.name.toLowerCase().includes(searchTerm) || 
      (app.platform && app.platform.toLowerCase().includes(searchTerm))
    );
  }

  // Clear search term
  clearAppSearch(): void {
    this.appSearchTerm = '';
    this.filterApplications();
  }

  // Get initials from a name (for avatar display)
  getInitials(name: string): string {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }

  // Add this method to apply time filter
  applyTimeFilter(): void {
    // Use userAuditLogs instead of deactivationLogs
    if (this.selectedTimeFilter === 'all') {
      this.filteredLogs = [...this.userAuditLogs];
      return;
    }
    
    const now = new Date();
    let startDate = new Date();
    
    switch(this.selectedTimeFilter) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }
    
    this.filteredLogs = this.userAuditLogs.filter((log: AuditLog) => {
      const logDate = new Date(log.date);
      return logDate >= startDate && logDate <= now;
    });
  }

  // Add this method to open revoke modal
  openRevokeModal(app: any) {
    // Implementation depends on your modal service
    console.log('Opening revoke modal for:', app.name);
    // Show modal logic here
  }

  // Helper method to create applications array from authorizedApps
  createApplicationsFromAuthorizedApps(authorizedApps: string[]): any[] {
    return authorizedApps.map(appName => {
      return {
        id: `app${Math.floor(Math.random() * 1000)}`,
        name: appName,
        platform: this.getDefaultPlatform(appName),
        accessLevel: 'Full Access',
        lastUsed: 'Not used yet',
        icon: this.getAppIcon(appName),
        iconBg: this.getAppIconBg(appName),
        status: 'Active'
      };
    });
  }

  // Helper methods to generate app details (same as in UserManagementComponent)
  getDefaultPlatform(appName: string): string {
    const platforms: {[key: string]: string} = {
      'Core Banking': 'Finacle 11.0',
      'Finnacle': 'Finnacle 10.2',
      'Gap': 'Gap 3.5',
      'E-Document Manager': 'EDM 2.0',
      'Active Directory': 'Windows Server 2019',
      'Email': 'Microsoft Exchange',
      'VPN': 'Cisco AnyConnect',
      'CRM': 'Dynamics 365',
      'ERP': 'SAP S/4HANA'
    };
    return platforms[appName] || 'Web Application';
  }

  getAppIcon(appName: string): string {
    const icons: {[key: string]: string} = {
      'Core Banking': 'university',
      'Finnacle': 'chart-line',
      'Gap': 'file-alt',
      'E-Document Manager': 'folder',
      'Active Directory': 'users',
      'Email': 'envelope',
      'VPN': 'shield-alt',
      'CRM': 'address-book',
      'ERP': 'cogs'
    };
    return icons[appName] || 'desktop';
  }

  getAppIconBg(appName: string): string {
    const colors: {[key: string]: string} = {
      'Core Banking': '#d1e3ff',
      'Finnacle': '#e9d5ff',
      'Gap': '#ffe8d1',
      'E-Document Manager': '#d1ffdb',
      'Active Directory': '#ffd1d1',
      'Email': '#d1f6ff',
      'VPN': '#f5d1ff',
      'CRM': '#fff5d1',
      'ERP': '#d1ffe3'
    };
    return colors[appName] || '#e0e0e0';
  }
}









