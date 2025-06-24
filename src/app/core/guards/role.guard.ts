import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const currentUser = this.authService.currentUser;
    if (currentUser && currentUser.role === 'Supervisor') {
      return true;
    } else {
      this.router.navigate(['/unauthorized']); // Or redirect to dashboard
      return false;
    }
  }
}
