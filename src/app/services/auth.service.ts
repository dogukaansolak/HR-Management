import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators'; // <-- YENİ: tap operatörünü import ediyoruz

import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';

// YENİ: API'den gelen başarılı giriş yanıtının modelini tanımlamak best practice'tir.
interface LoginResponse {
  accessToken: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5278/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // DEĞİŞTİ: login metodunu güncelliyoruz.
  public login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      // tap operatörü, Observable'dan gelen veriye "dokunmamızı" sağlar.
      // Yani, veri akışını bozmadan araya girip işlem yapabiliriz.
      tap((response: LoginResponse) => {
        // API'den başarılı bir yanıt geldiğinde bu blok çalışır.
        if (response && response.accessToken && response.username) {
          // Gelen token, kullanıcı adı ve rolü localStorage'a kaydediyoruz.
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('username', response.username);
          localStorage.setItem('userRole', response.role);
        }
      })
    );
  }

  public register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // YENİ: Kullanıcı adını localStorage'dan getiren metot.
  public getUsername(): string | null {
    return localStorage.getItem('username');
  }

  // YENİ: Kullanıcı rolünü localStorage'dan getiren metot.
  public getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // public redirectToDashboard(role: string): void {
  //   if (role === 'Admin') {
  //     this.router.navigate(['/admin-dashboard']);
  //   } else {
  //     this.router.navigate(['/dashboard']);
  //   }
  // }

  public redirectToDashboard(): void {
  // Şimdilik role bilgisi yok, default yönlendirme yapalım
  this.router.navigate(['/dashboard']);
}



  public isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  public logout(): void {
    // Sadece token'ı değil, tüm kullanıcı bilgilerini temizlemek daha doğrudur.
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    // localStorage.clear(); // Alternatif olarak her şeyi temizler.
    
    this.router.navigate(['/login']);
  }
}