import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/login-request.model';

interface LoginResponse {
  token: string;
  fullName: string;
  email: string;
  role: string; // 'admin' veya 'personnel'
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7168/api/Auth';

  constructor(private http: HttpClient, private router: Router) { }

  public login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response: LoginResponse) => {
        if (response && response.token) {
          localStorage.setItem('accessToken', response.token);
          localStorage.setItem('fullName', response.fullName);
          localStorage.setItem('email', response.email);
          localStorage.setItem('role', response.role);
        }
      })
    );
  }

  public getFullName(): string | null {
    return localStorage.getItem('fullName');
  }

  public getEmail(): string | null {
    return localStorage.getItem('email');
  }

  public getRole(): string | null {
    return localStorage.getItem('role');
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  public redirectToDashboard(): void {
    const role = this.getRole();
    if (role === 'personnel') {
      this.router.navigate(['/personnel-panel']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }


  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  get currentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
