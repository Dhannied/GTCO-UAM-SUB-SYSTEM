import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { AuditLogTableComponent } from '../shared/audit-log-table/audit-log-table.component';
import { AuditLog } from '../shared/models/audit-log.model';
import { AuditLogService } from '../shared/services/audit-log.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent, AuditLogTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  userName = 'John Doe';
  userRole = 'UAM Supervisor';
  lastLogin = '20/03/2025';
  
  totalDeactivations = 0;
  temporaryDeactivations = 0;
  permanentDeactivations = 0;
  activeUsers = 1450;
  totalReactivations = 0;
  
  // Filter states
  selectedTimeRange: string = 'all'; // Changed from 'This Month' to 'all'
  selectedApplication: string = 'Applications';
  
  // Add properties for date range
  startDate: string = '';
  endDate: string = '';
  showDateRangeDialog: boolean = false;
  tempStartDate: string = '';
  tempEndDate: string = '';

  // Holds all audit logs fetched from the service
  private rawAuditLogs: AuditLog[] = [];
  
  // Filtered data
  topDeactivatedApps: { name: string, count: number }[] = [];
  recentActivities: AuditLog[] = [];

  constructor(
    private router: Router,
    private auditLogService: AuditLogService
  ) {}

  ngOnInit(): void {
    this.loadAuditLogData();
  }

  ngAfterViewInit(): void {
    // This ensures we get fresh data when returning to the dashboard
    setTimeout(() => {
      this.loadAuditLogData();
    }, 100);
  }

  // Load initial data or refresh data
  loadAuditLogData(): void {
    this.auditLogService.getAllLogs().subscribe(logs => {
      console.log('Raw audit logs:', logs);
      this.rawAuditLogs = logs;
      this.applyFilters();
      // Debug: log filtered logs and metrics
      console.log('Filtered logs:', this.recentActivities);
      console.log('Metrics:', {
        totalDeactivations: this.totalDeactivations,
        temporaryDeactivations: this.temporaryDeactivations,
        permanentDeactivations: this.permanentDeactivations,
        totalReactivations: this.totalReactivations
      });
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

  logout(): void {
    // Perform any logout logic here (clear tokens, etc.)
    this.router.navigate(['/login']);
  }

  // Calculate the percentage width for app bars
  getAppBarPercentage(app: { name: string, count: number }): number {
    // Find the maximum count among the currently displayed apps
    const maxCount = Math.max(...this.topDeactivatedApps.map(a => a.count), 1);
    
    // Calculate percentage based on the maximum count in the current view
    return (app.count / maxCount) * 100;
  }

  // Method to handle date range change
  onDateRangeChange(): void {
    if (this.selectedTimeRange === 'custom') {
      // Show the date range dialog
      this.showDateRangeDialog = true;
      
      // Initialize with current values or defaults
      if (!this.startDate || !this.endDate) {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        this.tempStartDate = this.formatDateForInput(thirtyDaysAgo);
        this.tempEndDate = this.formatDateForInput(today);
      } else {
        this.tempStartDate = this.startDate;
        this.tempEndDate = this.endDate;
      }
    } else {
      // Apply the selected preset directly
      this.applyFilters();
    }
  }

  // Method to cancel the date range dialog
  cancelDateRangeDialog(): void {
    this.showDateRangeDialog = false;
    
    // If we were previously using a different preset, revert to it
    if (this.selectedTimeRange === 'custom' && !this.startDate) {
      this.selectedTimeRange = 'This Month'; // Default to "This Month" if no custom range was previously set
    }
  }

  // Method to apply the selected date range
  applyDateRange(): void {
    this.startDate = this.tempStartDate;
    this.endDate = this.tempEndDate;
    this.showDateRangeDialog = false;
    
    // Set the selectedTimeRange to 'custom' to indicate we're using a custom range
    this.selectedTimeRange = 'custom';
    
    // Apply filters with the new date range
    this.applyFilters();
  }

  // Helper method to format a date for the date input field
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

































