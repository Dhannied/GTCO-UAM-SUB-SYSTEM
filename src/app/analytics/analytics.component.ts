import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService } from '../shared/services/audit-log.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { AuditLog } from '../shared/models/audit-log.model';
import { ApplicationStateService } from '../shared/services/application-state.service';
// import { saveAs } from 'file-saver';

// Declare Chart.js to avoid TypeScript errors
declare var Chart: any;

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './analytics.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  // Chart instances
  private trendChart: any;
  private appChart: any;
  private typeChart: any;
  private departmentChart: any;
  private reasonChart: any;
  
  // Analytics data
  totalDeactivations: number = 0;
  pendingDeactivations: number = 0;
  completedDeactivations: number = 0;
  temporaryDeactivations: number = 0;
  permanentDeactivations: number = 0;
  
  // Filter
  selectedDateRange: string = 'last30days';
  dateFilter: string = 'month';
  
  // Department data
  departmentData = [
    { department: 'IT', count: 0 },
    { department: 'Finance', count: 0 },
    { department: 'HR', count: 0 },
    { department: 'Operations', count: 0 },
    { department: 'Marketing', count: 0 }
  ];
  
  // Reason data
  reasonData = [
    { reason: 'Resignation', count: 0 },
    { reason: 'Termination', count: 0 },
    { reason: 'Retirement', count: 0 },
    { reason: 'Leave of Absence', count: 0 },
    { reason: 'Other', count: 0 }
  ];

  // Add properties for date range
  startDate: string = '';
  endDate: string = '';
  showDateRangeDialog: boolean = false;
  tempStartDate: string = '';
  tempEndDate: string = '';
  selectedDateRangeText: string = 'Last 30 Days';

  constructor(
    private auditLogService: AuditLogService,
    private appStateService: ApplicationStateService
  ) { }

  ngOnInit(): void {
    // Load Chart.js from CDN
    this.loadChartJsScript().then(() => {
      // Load analytics data
      this.loadAnalyticsData();
    });
  }

  loadChartJsScript(): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }
  
  renderCharts(): void {
    this.renderTrendChart();
    this.renderAppChart();
    this.renderTypeChart();
    this.renderDepartmentChart();
    this.renderReasonChart();
  }
  
  renderTrendChart(): void {
    // Sample data for trend chart
    const monthData: {[key: string]: number} = {
      'Jan': 15,
      'Feb': 22,
      'Mar': 18,
      'Apr': 25,
      'May': 30,
      'Jun': 28,
      'Jul': 20,
      'Aug': 32,
      'Sep': 24,
      'Oct': 18,
      'Nov': 15,
      'Dec': 18
    };
    
    const sortedMonths = Object.keys(monthData);
    
    const ctx = document.getElementById('trendChart') as HTMLCanvasElement;
    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedMonths,
        datasets: [{
          label: 'Deactivations',
          data: sortedMonths.map(month => monthData[month]),
          borderColor: '#e84d1c',
          backgroundColor: 'rgba(232, 77, 28, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Deactivation Trends'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  renderAppChart(): void {
    // Sample data for application chart
    const appData: {[key: string]: number} = {
      'Active Directory': 85,
      'Email': 65,
      'VPN': 45,
      'CRM': 30,
      'ERP': 20
    };
    
    // Sort applications by count (descending)
    const sortedApps = Object.keys(appData).sort((a, b) => appData[b] - appData[a]);
    
    const ctx = document.getElementById('appChart') as HTMLCanvasElement;
    this.appChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedApps,
        datasets: [{
          label: 'Deactivations',
          data: sortedApps.map(app => appData[app]),
          backgroundColor: [
            'rgba(232, 77, 28, 0.8)',
            'rgba(232, 164, 28, 0.8)',
            'rgba(28, 164, 232, 0.8)',
            'rgba(28, 232, 164, 0.8)',
            'rgba(164, 28, 232, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Deactivations by Application'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  renderTypeChart(): void {
    const ctx = document.getElementById('typeChart') as HTMLCanvasElement;
    this.typeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Temporary', 'Permanent'],
        datasets: [{
          data: [this.temporaryDeactivations, this.permanentDeactivations],
          backgroundColor: [
            'rgba(232, 164, 28, 0.8)',
            'rgba(232, 77, 28, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Deactivation Types'
          }
        }
      }
    });
  }
  
  renderDepartmentChart(): void {
    const ctx = document.getElementById('departmentChart') as HTMLCanvasElement;
    this.departmentChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.departmentData.map(d => d.department),
        datasets: [{
          data: this.departmentData.map(d => d.count),
          backgroundColor: [
            'rgba(232, 77, 28, 0.8)',
            'rgba(28, 164, 232, 0.8)',
            'rgba(28, 232, 164, 0.8)',
            'rgba(164, 28, 232, 0.8)',
            'rgba(232, 164, 28, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Deactivations by Department'
          }
        }
      }
    });
  }
  
  renderReasonChart(): void {
    const ctx = document.getElementById('reasonChart') as HTMLCanvasElement;
    this.reasonChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: this.reasonData.map(r => r.reason),
        datasets: [{
          data: this.reasonData.map(r => r.count),
          backgroundColor: [
            'rgba(232, 77, 28, 0.8)',
            'rgba(232, 164, 28, 0.8)',
            'rgba(28, 164, 232, 0.8)',
            'rgba(28, 232, 164, 0.8)',
            'rgba(164, 28, 232, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Deactivation Reasons'
          }
        }
      }
    });
  }
  
  onDateFilterChange(): void {
    // In a real app, this would reload data based on the selected date range
    // For now, we'll just re-render the charts with the same data
    this.renderCharts();
  }

  exportReport(): void {
    // Create CSV content
    let csvContent = 'Analytics Report\n';
    csvContent += `Date Range: ${this.selectedDateRangeText}\n\n`;
    
    // Add summary metrics section
    csvContent += 'Summary Metrics\n';
    csvContent += 'Metric,Value\n';
    csvContent += `Total Deactivations,${this.totalDeactivations}\n`;
    csvContent += `Temporary Deactivations,${this.temporaryDeactivations}\n`;
    csvContent += `Permanent Deactivations,${this.permanentDeactivations}\n\n`;
    
    // Add department data section
    csvContent += 'Deactivations by Department\n';
    csvContent += 'Department,Count\n';
    this.departmentData.forEach(dept => {
      csvContent += `${dept.department},${dept.count}\n`;
    });
    csvContent += '\n';
    
    // Add reason data section
    csvContent += 'Deactivations by Reason\n';
    csvContent += 'Reason,Count\n';
    this.reasonData.forEach(reason => {
      csvContent += `${reason.reason},${reason.count}\n`;
    });
    csvContent += '\n';
    
    // Add application data section
    csvContent += 'Deactivations by Application\n';
    csvContent += 'Application,Count\n';
    // Get application data from the chart
    const appData: {[key: string]: number} = {
      'Active Directory': 85,
      'Email': 65,
      'VPN': 45,
      'CRM': 30,
      'ERP': 20
    };
    
    // Sort applications by count (descending)
    const sortedApps = Object.keys(appData).sort((a, b) => appData[b] - appData[a]);
    sortedApps.forEach(app => {
      csvContent += `${app},${appData[app]}\n`;
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${this.formatDate(new Date())}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Show success message
    alert('Report exported successfully!');
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadAnalyticsData(): void {
    // Get all audit logs
    this.auditLogService.getAllLogs().subscribe(logs => {
      console.log('Analytics: Loaded audit logs:', logs.length);
      
      // Calculate metrics from logs
      this.temporaryDeactivations = logs.filter(log => log.actionType === 'Temporary').length;
      this.permanentDeactivations = logs.filter(log => log.actionType === 'Permanent').length;
      this.totalDeactivations = this.temporaryDeactivations + this.permanentDeactivations;
      
      // Calculate pending and completed deactivations
      this.pendingDeactivations = Math.floor(this.totalDeactivations * 0.07); // Approximately 7% pending
      this.completedDeactivations = this.totalDeactivations - this.pendingDeactivations;
      
      // Calculate department data
      const deptCounts: {[key: string]: number} = {};
      logs.forEach(log => {
        if (log.actionType === 'Temporary' || log.actionType === 'Permanent') {
          // Get department from employee or use a default
          const dept = this.getDepartmentForEmployee(log.employeeId) || 'Unknown';
          deptCounts[dept] = (deptCounts[dept] || 0) + 1;
        }
      });
      
      // Update department data
      this.departmentData = Object.keys(deptCounts).map(dept => ({
        department: dept,
        count: deptCounts[dept]
      })).sort((a, b) => b.count - a.count);
      
      // Calculate reason data
      const reasonCounts: {[key: string]: number} = {};
      logs.forEach(log => {
        if (log.actionType === 'Temporary' || log.actionType === 'Permanent') {
          const reason = log.reason || 'Other';
          reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
        }
      });
      
      // Update reason data
      this.reasonData = Object.keys(reasonCounts).map(reason => ({
        reason,
        count: reasonCounts[reason]
      })).sort((a, b) => b.count - a.count);
      
      // Render charts with the updated data
      this.renderCharts();
    });
  }
  
  // Helper method to get department for an employee
  private getDepartmentForEmployee(employeeId: string): string | null {
    const employee = this.appStateService.getEmployeeById(employeeId);
    return employee?.department || null;
  }

  // Method to handle date range change
  onDateRangeChange(): void {
    if (this.selectedDateRange === 'custom') {
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
      this.applyDatePreset();
    }
  }

  // Method to cancel the date range dialog
  cancelDateRangeDialog(): void {
    this.showDateRangeDialog = false;
    
    // If we were previously using a different preset, revert to it
    if (this.selectedDateRange === 'custom' && !this.startDate) {
      this.selectedDateRange = 'last30days'; // Default to "Last 30 Days" if no custom range was previously set
    }
  }

  // Method to apply the selected date range
  applyDateRange(): void {
    this.startDate = this.tempStartDate;
    this.endDate = this.tempEndDate;
    this.showDateRangeDialog = false;
    
    // Set the selectedDateRange to 'custom' to indicate we're using a custom range
    this.selectedDateRange = 'custom';
    
    try {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      
      // Format the selected date range for display
      this.selectedDateRangeText = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
      
      // Load filtered data
      this.loadFilteredData(startDate, endDate);
    } catch (error) {
      console.error('Error applying date range:', error);
    }
  }

  // Method to apply date presets
  applyDatePreset(): void {
    const today = new Date();
    let startDate = new Date();
    
    switch (this.selectedDateRange) {
      case 'today':
        // Set to start of today
        startDate.setHours(0, 0, 0, 0);
        this.selectedDateRangeText = 'Today';
        this.dateFilter = 'today';
        break;
      case 'last7days':
        // Set to 7 days ago
        startDate.setDate(today.getDate() - 7);
        this.selectedDateRangeText = 'Last 7 Days';
        this.dateFilter = 'week';
        break;
      case 'last30days':
        // Set to 30 days ago
        startDate.setDate(today.getDate() - 30);
        this.selectedDateRangeText = 'Last 30 Days';
        this.dateFilter = 'month';
        break;
      case 'all':
        // For "All Time", we don't need specific dates
        this.startDate = '';
        this.endDate = '';
        this.selectedDateRangeText = 'All Time';
        this.dateFilter = 'all';
        this.loadAnalyticsData();
        return;
    }
    
    // Format dates for input fields (YYYY-MM-DD)
    this.startDate = this.formatDateForInput(startDate);
    this.endDate = this.formatDateForInput(today);
    
    // Load filtered data
    this.loadFilteredData(startDate, today);
  }

  loadFilteredData(startDate: Date, endDate: Date): void {
    // Set end date to end of day
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    this.auditLogService.getLogsByDateRange(startDate, endOfDay).subscribe((logs: AuditLog[]) => {
      // Calculate metrics
      this.totalDeactivations = logs.filter((log: AuditLog) => 
        log.actionType === 'Temporary' || log.actionType === 'Permanent'
      ).length;
      
      this.temporaryDeactivations = logs.filter((log: AuditLog) => 
        log.actionType === 'Temporary'
      ).length;
      
      this.permanentDeactivations = logs.filter((log: AuditLog) => 
        log.actionType === 'Permanent'
      ).length;
      
      // Calculate deactivations by application
      const appCounts: {[key: string]: number} = {};
      logs.forEach((log: AuditLog) => {
        if (log.actionType === 'Temporary' || log.actionType === 'Permanent') {
          if (!appCounts[log.application]) {
            appCounts[log.application] = 0;
          }
          appCounts[log.application]++;
        }
      });
      
      // Calculate deactivations by department
      const deptCounts: {[key: string]: number} = {};
      logs.forEach((log: AuditLog) => {
        if (log.actionType === 'Temporary' || log.actionType === 'Permanent') {
          // Extract department from employee ID or use a default
          const dept = log.department || 'Unknown';
          if (!deptCounts[dept]) {
            deptCounts[dept] = 0;
          }
          deptCounts[dept]++;
        }
      });
      
      // Calculate department data from counts
      this.departmentData = Object.keys(deptCounts).map(dept => ({
        department: dept,
        count: deptCounts[dept]
      })).sort((a, b) => b.count - a.count);
      
      // Update pending and completed counts
      this.pendingDeactivations = Math.floor(this.totalDeactivations * 0.07);
      this.completedDeactivations = this.totalDeactivations - this.pendingDeactivations;
      
      // Re-render charts
      this.renderCharts();
    });
  }

  // Helper method to format dates for input fields
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}



















