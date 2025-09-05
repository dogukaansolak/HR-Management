// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';
interface LoginResponse {
  token: string;     // backend: Token
  fullName: string;  // backend: FullName
  email: string;     // backend: Email
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7168/api/Auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  public login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response: LoginResponse) => {
        if (response && response.token) {
          // Token + kullanıcı bilgilerini kaydet
          localStorage.setItem('accessToken', response.token);
          localStorage.setItem('fullName', response.fullName);
          localStorage.setItem('email', response.email);
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

  public redirectToDashboard(): void {
    // Şimdilik role backend’den gelmiyor, sadece dashboard’a atabiliriz
    this.router.navigate(['/dashboard']);
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  public logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }
}