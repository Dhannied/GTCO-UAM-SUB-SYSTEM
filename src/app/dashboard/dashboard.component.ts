import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { AuditLogTableComponent, AuditLog } from '../shared/audit-log-table/audit-log-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent, AuditLogTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  userName = 'John Doe';
  userRole = 'UAM Supervisor';
  lastLogin = '20/03/2025';
  
  totalDeactivations = 200;
  temporaryDeactivations = 133;
  permanentDeactivations = 67;
  activeUsers = 1450;
  
  // Filter states
  selectedTimeRange: string = 'This Month';
  selectedApplication: string = 'Applications';
  
  // Original data
  private allMetrics = {
    totalDeactivations: 200,
    temporaryDeactivations: 133,
    permanentDeactivations: 67,
    activeUsers: 1450
  };

  private allDeactivatedApps = [
    { name: 'Core Banking', count: 78 },
    { name: 'Finnacle', count: 56 },
    { name: 'Gap', count: 42 },
    { name: 'E-Document Manager', count: 24 }
  ];
  
  private allRecentActivities: AuditLog[] = [
    { 
      date: '15 Jun 2025, 14:32', 
      employee: 'John Doe', 
      employeeId: 'EMP-10045',
      application: 'Core Banking', 
      actionType: 'Temporary', 
      duration: '14 days',
      reason: 'Employee on leave',
      officer: 'Sarah James' 
    },
    { 
      date: '10 May 2025, 09:15', 
      employee: 'Jane Smith', 
      employeeId: 'EMP-10046',
      application: 'Business Intelligence', 
      actionType: 'Permanent', 
      reason: 'Role change',
      officer: 'Robert Wilson' 
    },
    { 
      date: '05 May 2025, 11:20', 
      employee: 'Michael Brown', 
      employeeId: 'EMP-10047',
      application: 'Loan Management', 
      actionType: 'Reactivation', 
      reason: 'Access review approval',
      officer: 'Thomas Anderson' 
    }
  ];
  
  // Filtered data
  topDeactivatedApps = [...this.allDeactivatedApps];
  recentActivities: AuditLog[] = [...this.allRecentActivities];

  constructor(private router: Router) {}

  // Apply all filters
  applyFilters(): void {
    // Filter activities by time range
    this.filterActivities();
    
    // Filter deactivated apps
    this.filterDeactivatedApps();
    
    // Update metrics based on filters
    this.updateMetrics();
  }

  // Filter activities based on selected time range
  private filterActivities(): void {
    // In a real app, this would filter based on actual dates
    // For demo, just show fewer items for different time ranges
    if (this.selectedTimeRange === 'This Week') {
      this.recentActivities = this.allRecentActivities.slice(0, 2);
    } else if (this.selectedTimeRange === 'Today') {
      this.recentActivities = this.allRecentActivities.slice(0, 1);
    } else {
      // Default: This Month - show all
      this.recentActivities = [...this.allRecentActivities];
    }
  }

  // Filter deactivated apps based on selected application
  private filterDeactivatedApps(): void {
    // Create filtered app data based on time range first
    let timeFilteredApps = [...this.allDeactivatedApps];
    
    // Apply time range filter to app counts
    if (this.selectedTimeRange === 'This Week') {
      // Show 25% of monthly data for weekly view
      timeFilteredApps = timeFilteredApps.map(app => ({
        name: app.name,
        count: Math.round(app.count * 0.25)
      }));
    } else if (this.selectedTimeRange === 'Today') {
      // Show ~3% of monthly data for daily view
      timeFilteredApps = timeFilteredApps.map(app => ({
        name: app.name,
        count: Math.round(app.count * 0.03)
      }));
    }
    
    // Then apply application filter if needed
    if (this.selectedApplication !== 'Applications') {
      // Filter to show only the selected application
      this.topDeactivatedApps = timeFilteredApps.filter(
        app => app.name === this.selectedApplication
      );
    } else {
      // Show all applications with time filter applied
      this.topDeactivatedApps = timeFilteredApps;
    }
    
    // Sort by count in descending order to show highest counts first
    this.topDeactivatedApps.sort((a, b) => b.count - a.count);
  }

  // Update metrics based on selected filters
  private updateMetrics(): void {
    // Apply time range filter to metrics
    let timeMultiplier = 1;
    if (this.selectedTimeRange === 'This Week') {
      timeMultiplier = 0.25; // Show 25% of monthly data for weekly view
    } else if (this.selectedTimeRange === 'Today') {
      timeMultiplier = 0.03; // Show ~3% of monthly data for daily view
    }
    
    // Apply application filter to metrics
    let appMultiplier = 1;
    if (this.selectedApplication !== 'Applications') {
      // Find the percentage this app represents of total deactivations
      const selectedApp = this.allDeactivatedApps.find(app => app.name === this.selectedApplication);
      if (selectedApp) {
        appMultiplier = selectedApp.count / this.allMetrics.totalDeactivations;
      }
    }
    
    // Calculate combined multiplier
    const multiplier = timeMultiplier * appMultiplier;
    
    // Update all metrics
    this.totalDeactivations = Math.round(this.allMetrics.totalDeactivations * multiplier);
    this.temporaryDeactivations = Math.round(this.allMetrics.temporaryDeactivations * multiplier);
    this.permanentDeactivations = Math.round(this.allMetrics.permanentDeactivations * multiplier);
    
    // Active users don't decrease as much with filters
    const activeUserMultiplier = 1 - ((1 - multiplier) * 0.1); // Less impact on active users
    this.activeUsers = Math.round(this.allMetrics.activeUsers * activeUserMultiplier);
  }

  logout(): void {
    // Perform any logout logic here (clear tokens, etc.)
    this.router.navigate(['/login']);
  }

  // Calculate the percentage width for app bars
  getAppBarPercentage(app: { name: string, count: number }): number {
    // Find the maximum count among the currently displayed apps
    const maxCount = Math.max(...this.topDeactivatedApps.map(a => a.count));
    
    // If there's only one app displayed or all apps have 0 count
    if (maxCount === 0) {
      return 0;
    }
    
    // Calculate percentage based on the maximum count in the current view
    // This ensures the bars are always proportional to the current view
    return (app.count / maxCount) * 100;
  }
}



















