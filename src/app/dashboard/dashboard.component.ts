import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { AuditLogTableComponent } from '../shared/audit-log-table/audit-log-table.component';
import { AuditLog } from '../shared/models/audit-log.model';
import { AuditLogService } from '../shared/services/audit-log.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent, AuditLogTableComponent],
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // User information
  userName = '';
  userRole = '';
  lastLogin = '';
  
  // Statistics
  totalDeactivations = 0;
  temporaryDeactivations = 0;
  permanentDeactivations = 0;
  activeUsers = 0;
  totalReactivations = 0;
  
  // Filter states
  selectedTimeRange: string = 'all';
  selectedApplication: string = 'Applications';
  
  // Date range
  startDate: string = '';
  endDate: string = '';
  showDateRangeDialog: boolean = false;
  tempStartDate: string = '';
  tempEndDate: string = '';

  // Audit logs
  private rawAuditLogs: AuditLog[] = [];
  
  // Filtered data
  topDeactivatedApps: { name: string, count: number }[] = [];
  recentActivities: AuditLog[] = [];

  constructor(
    private router: Router,
    private auditLogService: AuditLogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadAuditLogData();
    
    // Set default date range if needed
    const today = new Date();
    this.endDate = today.toISOString().split('T')[0];
    
    // Set start date to 30 days ago by default
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    this.startDate = thirtyDaysAgo.toISOString().split('T')[0];
  }

  ngAfterViewInit(): void {
    // This ensures we get fresh data when returning to the dashboard
    setTimeout(() => {
      this.loadAuditLogData();
    }, 100);
  }

  // Load user information from auth service
  loadUserInfo(): void {
    const currentUser = this.authService.currentUser;
    console.log('Current user from auth service:', currentUser);
    
    if (currentUser) {
      this.userName = currentUser.name || 'User';
      this.userRole = currentUser.role || 'User';
      
      // Format last login date if available
      if (currentUser.lastActive) {
        const lastLoginDate = new Date(currentUser.lastActive);
        this.lastLogin = lastLoginDate.toLocaleDateString() + ' at ' + 
          lastLoginDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          });
      } else {
        // If lastActive is not available, show a message indicating this is the first login
        this.lastLogin = 'First login';
      }
    } else {
      console.warn('No user data available');
      // Set default values if user data is not available
      this.userName = 'Guest';
      this.userRole = 'Viewer';
      this.lastLogin = 'Not available';
    }
  }

  // Load audit log data
  loadAuditLogData(): void {
    console.log('Loading audit log data...');
    this.auditLogService.getAllLogs().subscribe({
      next: (logs) => {
        console.log('Raw audit logs received:', logs);
        this.rawAuditLogs = logs;
        this.applyFilters();
        
        // Set active users count (this could come from a different service)
        this.activeUsers = 1450; // This is a placeholder, replace with real data
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
        // Handle error - maybe show a notification to the user
        this.rawAuditLogs = [];
        this.recentActivities = [];
      },
      complete: () => {
        console.log('Audit log loading complete');
      }
    });
  }

  // Apply all filters
  applyFilters(): void {
    if (!this.rawAuditLogs || this.rawAuditLogs.length === 0) {
      return; // No data to filter
    }

    let filteredLogs = [...this.rawAuditLogs];
    
    // Apply time range filter
    if (this.selectedTimeRange === 'This Month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filteredLogs = filteredLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= oneMonthAgo;
      });
    } else if (this.selectedTimeRange === 'This Week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filteredLogs = filteredLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= oneWeekAgo;
      });
    } else if (this.selectedTimeRange === 'Today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filteredLogs = filteredLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= today;
      });
    } else if (this.selectedTimeRange === 'custom' && this.startDate && this.endDate) {
      try {
        const customStartDate = new Date(this.startDate);
        customStartDate.setHours(0, 0, 0, 0); // Start of the selected day
        const customEndDate = new Date(this.endDate);
        customEndDate.setHours(23, 59, 59, 999); // End of the selected day
        
        filteredLogs = filteredLogs.filter(log => {
          const logDate = new Date(log.date);
          return logDate >= customStartDate && logDate <= customEndDate;
        });
      } catch (error) {
        console.error('Error filtering by custom date range:', error);
      }
    } 
    // 'all' time range means no date filtering beyond what's in rawAuditLogs
    
    // Apply application filter
    if (this.selectedApplication !== 'Applications') {
      filteredLogs = filteredLogs.filter(log => 
        log.application === this.selectedApplication
      );
    }
    
    // Sort by date (newest first)
    filteredLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Update recent activities
    this.recentActivities = filteredLogs;

    // Calculate metrics from filteredLogs
    this.temporaryDeactivations = filteredLogs.filter(log => log.actionType === 'Temporary').length;
    this.permanentDeactivations = filteredLogs.filter(log => log.actionType === 'Permanent').length;
    this.totalDeactivations = this.temporaryDeactivations + this.permanentDeactivations;
    this.totalReactivations = filteredLogs.filter(log => log.actionType === 'Reactivation').length;

    // Calculate top deactivated apps from filteredLogs
    const appCounts: { [key: string]: number } = {};
    filteredLogs.forEach(log => {
      if (log.actionType === 'Temporary' || log.actionType === 'Permanent') {
        appCounts[log.application] = (appCounts[log.application] || 0) + 1;
      }
    });

    this.topDeactivatedApps = Object.keys(appCounts).map(app => ({
      name: app,
      count: appCounts[app]
    }));
    this.topDeactivatedApps.sort((a, b) => b.count - a.count);
    // Limit to top 4 apps
    this.topDeactivatedApps = this.topDeactivatedApps.slice(0, 4);

    // Log final metrics after filters for verification
    console.log('Metrics after applying filters:', {
      totalDeactivations: this.totalDeactivations,
      temporaryDeactivations: this.temporaryDeactivations,
      permanentDeactivations: this.permanentDeactivations,
      totalReactivations: this.totalReactivations,
      activeUsers: this.activeUsers
    });
    console.log('Top deactivated apps after filters:', this.topDeactivatedApps);
  }

  // Handle date range change
  onDateRangeChange(): void {
    if (this.selectedTimeRange === 'custom') {
      this.showDateRangeDialog = true;
      // Initialize with current values or defaults
      this.tempStartDate = this.startDate || '';
      this.tempEndDate = this.endDate || '';
    } else {
      this.applyFilters();
    }
  }

  // Apply custom date range
  applyCustomDateRange(): void {
    this.startDate = this.tempStartDate;
    this.endDate = this.tempEndDate;
    this.showDateRangeDialog = false;
    this.applyFilters();
  }

  // Cancel custom date range
  cancelCustomDateRange(): void {
    this.showDateRangeDialog = false;
    // If no dates were previously set, revert to 'all'
    if (!this.startDate && !this.endDate) {
      this.selectedTimeRange = 'all';
    }
  }

  // Log out user
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Calculate percentage for app bars
  getAppBarPercentage(app: { name: string, count: number }): number {
    const maxCount = Math.max(...this.topDeactivatedApps.map(a => a.count), 1);
    return (app.count / maxCount) * 100;
  }
}





