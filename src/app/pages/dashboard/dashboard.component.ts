// src/app/pages/dashboard/dashboard.component.ts
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,               // Angular 20 standalone component
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [RouterLink, RouterLinkActive, RouterOutlet] // Router directives
})
export class DashboardComponent {

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // Başlangıçta yapılacak işlemler
  }

  // Kullanıcı çıkışı
  logout() {
    console.log("Çıkış yapıldı!");
    this.authService.logout();
  }
  menuOpen = false;
  
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
    closeMenuOnOverlayClick() {
    const menuToggle = document.getElementById('menu-toggle') as HTMLInputElement;
    if (menuToggle) menuToggle.checked = false;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const sideNav = document.querySelector('.side-nav');
    const hamburger = document.querySelector('.hamburger-menu');

    // Menü açıksa ve tıklama menü veya hamburger dışında ise menüyü kapat
    if (this.menuOpen && sideNav && hamburger &&
        !sideNav.contains(target) && !hamburger.contains(target)) {
      this.menuOpen = false;
    }
  }
  

}
