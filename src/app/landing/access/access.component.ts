import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent implements OnInit {
  userId!: string;
  isDeactivated: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Get the ID from route params
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = id;
        this.checkIfDeactivated(id);
      }
    });
  }

  checkIfDeactivated(id: string) {
    this.http.get<any>(`/api/users/deactivated/${id}`).subscribe({
      next: (user) => {
        this.isDeactivated = true;
      },
      error: (err) => {
        this.isDeactivated = false;
        this.errorMessage = 'You are not deactivated or user not found.';
      }
    });
  }
}
