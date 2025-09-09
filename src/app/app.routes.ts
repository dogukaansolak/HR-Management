import { Routes } from '@angular/router';

// === Bileşen importları ===
import { LoginComponent } from './auth/login/login.component';
import { Register } from './auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardHome } from './pages/dashboard-home/dashboard-home';
import { PersonnelComponent } from './pages/personnel/personnel.component';
import { PermissionComponent } from './pages/permission/permission.component'; // ✅ doğru import
import { CostComponent } from './pages/cost/cost.component';
import { CandidateManagementComponent } from './pages/candidate/candidate.component';
import { Reports } from './pages/reports/reports.component';
import { Settings } from './pages/settings/settings.component';
import { SupportComponent } from './support/support.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHome },
      { path: 'personnel', component: PersonnelComponent },
      { path: 'permission', component: PermissionComponent }, // ✅ izin sayfası
      { path: 'cost', component: CostComponent },
      { path: 'candidate', component: CandidateManagementComponent },
      { path: 'reports', component: Reports },
      { path: 'settings', component: Settings },
      { path: 'support', component: SupportComponent },

    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
