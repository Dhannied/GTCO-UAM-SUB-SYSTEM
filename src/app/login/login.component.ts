import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  employeeId: string = '';
  password: string = '';
  // Removed selectedRole property since we're removing the role selector
  
  constructor(private router: Router) {}
  
  login() {
    // In a real app, you would validate credentials against a backend
    console.log('Logging in with:', {
      employeeId: this.employeeId
      // Removed role from the log since we're no longer selecting it
    });
    
    // Navigate to dashboard after login
    this.router.navigate(['/dashboard']);
  }
}
