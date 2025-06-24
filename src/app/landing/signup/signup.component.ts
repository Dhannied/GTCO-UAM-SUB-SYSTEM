import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
   email: string = '';
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
    
    const credentials = {
      email: this.email,
      password: this.password
    };
    
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login successful:', response);
        
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/landing/access';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);
        
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else {
          this.errorMessage = 'You do not have access to this application.';
        }
      }
    });
  }
}
