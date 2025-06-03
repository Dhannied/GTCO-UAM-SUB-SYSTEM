import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  lastActive?: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  department: string;
  role: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  department?: string;
  role?: string;
  status?: string;
  lastActive?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('users');
  }

  getUser(id: string): Observable<User> {
    return this.apiService.get<User>(`users/${id}`);
  }

  createUser(user: CreateUserDto): Observable<User> {
    return this.apiService.post<User>('users', user);
  }

  updateUser(id: string, user: UpdateUserDto): Observable<User> {
    return this.apiService.put<User>(`users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.apiService.delete<void>(`users/${id}`);
  }
}