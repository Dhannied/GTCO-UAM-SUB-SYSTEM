import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Employee } from '../models/employee.model';
import { environment } from '../../../environments/environment';
import { Application } from './application-state.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      tap((employees) => console.log(`Fetched ${employees.length} employees`)),
      catchError((error) => {
        console.error('Error fetching employees', error);
        // Return empty array if API fails
        return of([]);
      })
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`).pipe(
      tap((employee) => console.log(`Fetched employee with id ${id}`)),
      catchError((error) => {
        console.error(`Error fetching employee with id ${id}`, error);
        // Return empty employee if API fails
        return of({} as Employee);
      })
    );
  }

  getApplicationsByUserId(userId: string) {
    return this.http.get<Application[]>(`http://localhost:3000/applications/user/${userId}`);
    // return this.http.get<Application[]>(`/applications/user/${userId}`);
  }

  generateMockEmployees(count: number = 20): Observable<Employee[]> {
    return this.http
      .post<Employee[]>(`${this.apiUrl}/generate-mock`, { count })
      .pipe(
        tap((employees) =>
          console.log(`Generated ${employees.length} mock employees`)
        ),
        catchError((error) => {
          console.error('Error generating mock employees', error);
          return of([]);
        })
      );
  }
}
