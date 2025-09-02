import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginRequest } from '../../models/login-request.model';
import { AuthService } from '../../services/auth.service';  // <-- AuthService'i import ettik

export interface LoginResponse {
  token: string;
  fullName: string;
  email: string;
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

    // 🔹 Backend'e istek atıyoruz
    this.authService.login(this.loginData).subscribe({
      next: (res: LoginResponse) => {
        console.log("Login başarılı:", res);

        // 🔹 JWT token'ı localStorage'a kaydet
        localStorage.setItem('token', res.token);

        this.authService.redirectToDashboard();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error("Login hatası:", err);
        this.errorMessage = "E-posta veya şifre hatalı.";
        this.isLoading = false;
      }
    });
  }
}