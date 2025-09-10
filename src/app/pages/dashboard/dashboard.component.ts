import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LeaveFormComponent } from '../permission/leaves/leave-form.component';
import { LeaveListComponent } from '../permission/leaves/leave-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    CommonModule,
    NgIf,
    LeaveFormComponent,
    LeaveListComponent
  ]
})
export class DashboardComponent {
  menuOpen = false;
  showLeaveForm = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  isAdmin(): boolean {
    return this.authService.currentUser?.role === 'Admin';
  }

  isPersonnel(): boolean {
    return this.authService.currentUser?.role === 'Personnel';
  }

  toggleLeaveForm() {
    this.showLeaveForm = !this.showLeaveForm;
  }

  onLeaveCreated() {
    // Form submit edildikten sonra listeyi yenilemek için
    this.showLeaveForm = false;
  }

  logout() {
    console.log("Çıkış yapıldı!");
    this.authService.logout();
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  closeMenuOnOverlayClick() {
    const menuToggle = document.getElementById('menu-toggle') as HTMLInputElement;
    if (menuToggle) menuToggle.checked = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const sideNav = document.querySelector('.side-nav');
    const hamburger = document.querySelector('.hamburger-menu');

    if (this.menuOpen && sideNav && hamburger &&
        !sideNav.contains(target) && !hamburger.contains(target)) {
      this.menuOpen = false;
    }
  }
}
