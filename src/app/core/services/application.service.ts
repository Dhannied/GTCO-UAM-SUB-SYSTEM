import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Application {
  id: string;
  name: string;
  platform: string;
  accessLevel: string;
  lastUsed?: Date;
  icon: string;
  iconBg: string;
  status: string;
  deactivationType?: string;
  user: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApplicationDto {
  name: string;
  platform: string;
  accessLevel: string;
  icon: string;
  iconBg: string;
  userId: string;
}

export interface UpdateApplicationDto {
  name?: string;
  platform?: string;
  accessLevel?: string;
  icon?: string;
  iconBg?: string;
  status?: string;
  deactivationType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private apiService: ApiService) {}

  getApplications(): Observable<Application[]> {
    return this.apiService.get<Application[]>('applications');
  }

  getApplication(id: string): Observable<Application> {
    return this.apiService.get<Application>(`applications/${id}`);
  }

  getUserApplications(userId: string): Observable<Application[]> {
    return this.apiService.get<Application[]>(`applications/user/${userId}`);
  }

  createApplication(application: CreateApplicationDto): Observable<Application> {
    return this.apiService.post<Application>('applications', application);
  }

  updateApplication(id: string, application: UpdateApplicationDto): Observable<Application> {
    return this.apiService.put<Application>(`applications/${id}`, application);
  }

  deleteApplication(id: string): Observable<void> {
    return this.apiService.delete<void>(`applications/${id}`);
  }
}