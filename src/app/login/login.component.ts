import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

interface LoginCredentials {
  employeeId: string;
  password: string;
}

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
  isLoading: boolean = false;
  errorMessage: string = '';
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}
  
  login() {
    this.isLoading = true;
    this.errorMessage = '';
    
    const credentials: LoginCredentials = {
      employeeId: this.employeeId,
      password: this.password
    };
    
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login successful:', response);
        
        // Get return url from route parameters or default to '/'
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);
        
        if (error.status === 401) {
          this.errorMessage = 'Invalid employee ID or password';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    });
  }
}


