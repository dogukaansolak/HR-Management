// // src/app/auth/login/login.component.ts

// // === GEREKLİ MODÜLLERİN VE SINIFLARIN İÇERİ AKTARILMASI ===
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { FormsModule, NgForm } from '@angular/forms'; // NgForm'u da import ediyoruz

// // Her model ve servis kendi dosyasından, doğru yollarla import ediliyor.
// import { LoginRequest } from '../../models/login-request.model';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, RouterModule, FormsModule],
//   // TAVSİYE: Template'i ayrı bir .html dosyasına taşımak daha düzenlidir.
//   templateUrl: './login.html',
//   // TAVSİYE: Dosya adını standartlara uygun olarak 'login.component.css' yapmanız önerilir.
//   styleUrls: ['./login.css']
// })
// export class LoginComponent {

//   // === DEĞİŞKEN TANIMLAMALARI ===

//   // Form verilerini tutmak için doğrudan bir model (class/interface) kullanmak daha temiz bir yöntemdir.
//   public loginData: LoginRequest = { Email: 'admin@test.com', Password: '123456-' };
  
//   // Kullanıcıya geri bildirim vermek için kullanılacak değişkenler.
//   public errorMessage: string | null = null;
//   public isLoading: boolean = false; // Yükleme animasyonunu kontrol eder.

//   // === CONSTRUCTOR (YAPICI METOT) ===
//   constructor(
//     private authService: AuthService,
//     private router: Router // Yönlendirme yapmak için Router servisini enjekte ediyoruz.
//   ) {}

//   /**
//    * Kullanıcı 'Giriş Yap' butonuna tıkladığında bu metot çalışır.
//    * @param form - HTML'den gelen formun referansıdır.
//    */
//   public onSubmit(form: NgForm): void {
//     // Formun temel Angular doğrulama kurallarından geçip geçmediğini kontrol ediyoruz.
//     if (form.invalid) {
//       this.errorMessage = 'Lütfen e-posta ve şifre alanlarını doldurun.';
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = null;

//     // AuthService üzerinden login API isteğini gönderiyoruz.
//     this.authService.login(this.loginData).subscribe({
//       /**
//        * API'den başarılı bir cevap geldiğinde (next) bu blok çalışır.
//        * DASHBOARD'A YÖNLENDİRME MANTIĞI BURADA!
//        */
//       next: (response) => {
//         this.isLoading = false;

//         // 1. ADIM (EN ÖNEMLİ): API'den gelen access token'ı localStorage'a kaydediyoruz.
//         // Auth Guard, bir sonraki sayfada bu token'ın varlığını kontrol edecek.
//         localStorage.setItem('accessToken', response.accessToken);
//         // (İsteğe bağlı) Diğer kullanıcı bilgilerini de kaydedebiliriz.
//         localStorage.setItem('username', response.username);
//         localStorage.setItem('userRole', response.role);

//         // 2. ADIM: Kullanıcıyı programatik olarak '/dashboard' rotasına yönlendiriyoruz.
//         this.router.navigate(['/dashboard']);
//       },
//       /**
//        * API'den bir hata dönerse (error) bu blok çalışır.
//        */
//       error: (err) => {
//         this.isLoading = false;
//         // Hata mesajını yönetmek için ayrı bir metot kullanıyoruz.
//         this.handleLoginError(err);
//         //this.handleLoginError(err);
//       }
//     });
//   }

//   /**
//    * Sunucudan gelen hataları analiz eder ve kullanıcıya uygun bir mesaj gösterir.
//    * @param err Sunucudan dönen hata objesi
//    */
//   private handleLoginError(err: any): void {
//     if (err.status === 401) {
//       this.errorMessage = 'E-posta veya şifre hatalı.';
//     } else if (err.error?.message) {
//       // Eğer sunucu 'message' adında bir alanla hata detayını gönderiyorsa onu kullan.
//       this.errorMessage = err.error.message;
//     } else {
//       this.errorMessage = 'Giriş sırasında bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
//     }
//   }
// }



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
    // Role yok, parametresiz çağır
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
