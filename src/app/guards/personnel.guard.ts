import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PersonnelGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getRole();
    const token = this.authService.isAuthenticated();

    if (token && role === 'personnel') {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
