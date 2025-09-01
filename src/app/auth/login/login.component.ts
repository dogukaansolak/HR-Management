// src/app/auth/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginRequest } from '../../models/login-request.model';
import { AuthService } from '../../services/auth.service';

// Backend'den gelen gerçek response tipini burada tanımlıyoruz
export interface LoginResponse {
  accessToken: string;
  username: string;
  role: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  public loginData: LoginRequest = { Email: '', Password: '' };
  public errorMessage: string | null = null;
  public isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  public onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Lütfen alanları doldurun.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Backend'e login isteği gönderiyoruz
    this.authService.login(this.loginData).subscribe({
      next: (res: LoginResponse) => {
        console.log("Login başarılı:", res);

        // Access token ve kullanıcı bilgilerini localStorage'a kaydediyoruz
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('username', res.username);
        localStorage.setItem('userRole', res.role);

        this.isLoading = false;

        // Dashboard'a yönlendiriyoruz
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error("Login hatası:", err);
        if (err.status === 401) {
          this.errorMessage = "E-posta veya şifre hatalı.";
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = "Giriş sırasında bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.";
        }
        this.isLoading = false;
      }
    });
  }
}
