import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
// import { saveAs } from 'file-saver';

// Declare Chart.js to avoid TypeScript errors
declare var Chart: any;

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
  templateUrl: './analytics.component.html',
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
  totalDeactivations: number = 245;
  pendingDeactivations: number = 18;
  completedDeactivations: number = 227;
  temporaryDeactivations: number = 87;
  permanentDeactivations: number = 158;
  
  // Filter
  selectedDateRange: string = 'last30days';
  dateFilter: string = 'month';
  
  // Department data
  departmentData = [
    { department: 'IT', count: 78 },
    { department: 'Finance', count: 45 },
    { department: 'HR', count: 32 },
    { department: 'Operations', count: 56 },
    { department: 'Marketing', count: 34 }
  ];
  
  // Reason data
  reasonData = [
    { reason: 'Resignation', count: 98 },
    { reason: 'Termination', count: 60 },
    { reason: 'Retirement', count: 42 },
    { reason: 'Leave of Absence', count: 25 },
    { reason: 'Other', count: 20 }
  ];

  constructor() { }

  ngOnInit(): void {
    // Load Chart.js from CDN
    this.loadChartJsScript().then(() => {
      this.renderCharts();
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
    // Create report data
    const reportData = {
      title: 'Analytics Report',
      dateRange: this.selectedDateRange,
      generatedAt: new Date().toISOString(),
      metrics: {
        totalDeactivations: this.totalDeactivations,
        pendingDeactivations: this.pendingDeactivations,
        completedDeactivations: this.completedDeactivations,
        temporaryDeactivations: this.temporaryDeactivations,
        permanentDeactivations: this.permanentDeactivations
      },
      departmentData: this.departmentData,
      reasonData: this.reasonData
    };
    
    // Convert to JSON string
    const jsonData = JSON.stringify(reportData, null, 2);
    
    // Create blob and download using native browser APIs
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${this.formatDate(new Date())}.json`;
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
}


