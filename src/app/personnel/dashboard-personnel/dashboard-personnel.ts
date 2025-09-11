import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // NgClass, NgIf gibi direktifler için gereklidir
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-personnel', // Selector'ın bu olduğunu varsayıyorum
  standalone: true,
  templateUrl: './dashboard-personnel.html',
  styleUrls: ['./dashboard-personnel.css'],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ]
})
export class DashboardPersonnelComponent {
  // Menünün açık/kapalı durumunu takip eden değişken
  isMenuOpen = false;

  constructor(public authService: AuthService) {}

  // Rol kontrol metodları template'te kullanılabilir
  isAdmin(): boolean {
    return this.authService.currentUser?.role === 'HRManager';
  }

  isPersonnel(): boolean {
    return this.authService.currentUser?.role === 'Personnel';
  }

  // Menüyü açıp kapatan fonksiyon
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Navigasyon linkine tıklandığında menüyü kapatır (mobil kullanım için ideal)
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  // Çıkış yapma fonksiyonu
  logout(): void {
    this.authService.logout();
    console.log("Çıkış yapıldı!");
  }
}