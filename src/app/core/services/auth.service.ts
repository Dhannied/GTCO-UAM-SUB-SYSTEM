import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user', e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(credentials: LoginDto): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('auth/login', credentials).pipe(
      tap(response => {
        console.log('Login response from API:', response);
        
        // Store user details and token in localStorage
        const userData = {
          ...response.user,
          accessToken: response.accessToken
        };
        
        console.log('User data to store:', userData);
        
        // If the API response doesn't include lastActive, use current time
        if (!userData.lastActive) {
          console.log('No lastActive in response, using current time');
          userData.lastActive = new Date();
        } else {
          console.log('lastActive from response:', userData.lastActive);
        }
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        this.currentUserSubject.next(userData);
      })
    );
  }

  logout(): void {
    // Store the current lastActive time before logout
    const currentUser = this.currentUser;
    if (currentUser && currentUser.lastActive) {
      localStorage.setItem('previousLastActive', currentUser.lastActive);
    }
    
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  get currentUser(): any | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.currentUser?.accessToken || null;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }
}