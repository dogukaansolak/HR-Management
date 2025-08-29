// src/app/app.routes.ts

import { Routes } from '@angular/router';

// === Bileşen importları (İsimler standartlara uygun hale getirildi) ===
import { LoginComponent } from './auth/login/login.component';
import { Register } from './auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardHome } from './pages/dashboard-home/dashboard-home'; // Düzeltildi
import { PersonnelComponent } from './pages/personnel/personnel.component';
// Update the import to match the actual export from the file
import { PermissionComponent } from './pages/permission/permission.component';

import { Cost } from './pages/cost/cost.component';
import { Candidate } from './pages/candidate/candidate.component';
import { Reports } from './pages/reports/reports.component';
import { Settings } from './pages/settings/settings.component';

// import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // --- Herkese açık rotalar ---
  { 
    path: 'login',
    component: LoginComponent
  },

  { path: 'personnel', component: PersonnelComponent },

  { 
    path: 'register',
    component: Register // Düzeltildi
  },

  // --- Dashboard Layout ve Alt Rotalar ---
  {
    path: 'dashboard',
    component: DashboardComponent, // Bu bizim Ana İskelet (Layout) Component'imiz
    // canActivate: [authGuard],
    children: [
      // === BURASI DÜZELTİLDİ ===
      // '/dashboard' yoluna gelindiğinde, <router-outlet> içine DashboardHomeComponent'i yükle.
      { path: '', component: DashboardHome },

      // Diğer alt rotalar
      { path: 'personnel', component: PersonnelComponent },   // Düzeltildi
      { path: 'permission', component: PermissionComponent }, // Düzeltildi
      { path: 'cost', component: Cost },             // Düzeltildi
      { path: 'candidate', component: Candidate },   // Düzeltildi
      { path: 'reports', component: Reports },       // Düzeltildi
      { path: 'settings', component: Settings }       // Düzeltildi
    ]
  },

  // --- Yönlendirmeler ---
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];