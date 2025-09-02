// // src/app/services/auth.service.ts

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Router } from '@angular/router';

// import { LoginRequest } from '../models/login-request.model';
// import { RegisterRequest } from '../models/register-request.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:5278/api/auth';

//   //private readonly apiUrl = 'https://sizin-api-adresiniz.com/api/auth'; // <-- Kendi API adresinizle değiştirin!

//   constructor(
//     private http: HttpClient,
//     private router: Router
//   ) { }

//   public login(data: LoginRequest): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, data);
//   }

//   public register(data: RegisterRequest): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register`, data);
//   }

//   public redirectToDashboard(role: string): void {
//     if (role === 'Admin') {
//       this.router.navigate(['/admin-dashboard']);
//     } else {
//       this.router.navigate(['/dashboard']);
//     }
//   }

//   /**
//    * HATA DÜZELTİLDİ: Eksik olan bu metot eklendi.
//    * Kullanıcının giriş yapıp yapmadığını kontrol eder.
//    * localStorage'da bir 'accessToken' olup olmadığını kontrol ederek basit bir doğrulama yapar.
//    * @returns Kullanıcı giriş yapmışsa true, yapmamışsa false döner.
//    */
//   public isAuthenticated(): boolean {
//     // !! (çift ünlem) operatörü, bir değeri boolean (true/false) karşılığına çevirir.
//     // Eğer localStorage.getItem('accessToken') bir değer döndürürse (string), sonuç true olur.
//     // Eğer null döndürürse, sonuç false olur.
//     return !!localStorage.getItem('accessToken');
//   }

//   public logout(): void {
//     localStorage.clear();
//     this.router.navigate(['/login']);
//   }
// }

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