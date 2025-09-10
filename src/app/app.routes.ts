// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { Register } from './auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardHome } from './pages/dashboard-home/dashboard-home';
import { PersonnelComponent } from './pages/personnel/personnel.component';
import { PermissionComponent } from './pages/permission/permission.component';
import { CostComponent } from './pages/cost/cost.component';
import { CandidateManagementComponent } from './pages/candidate/candidate.component';
import { Reports } from './pages/reports/reports.component';
import { Settings } from './pages/settings/settings.component';
import { SupportComponent } from './support/support.component';

import { AdminGuard } from './guards/admin.guard';
import { PersonnelGuard } from './guards/personnel.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AdminGuard], // sadece admin görebilir
    children: [
      { path: '', component: DashboardHome },
      { path: 'personnel', component: PersonnelComponent },
      { path: 'permission', component: PermissionComponent },
      { path: 'cost', component: CostComponent },
      { path: 'candidate', component: CandidateManagementComponent },
      { path: 'reports', component: Reports },
      { path: 'settings', component: Settings },
      { path: 'support', component: SupportComponent },
    ]
  },

  {
    path: 'personnel-panel',
    loadChildren: () =>
      import('./personnel/user-personnel.module').then(m => m.PersonnelModule),
    canActivate: [PersonnelGuard] // sadece personel görebilir
  },

  // Default ve fallback
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
