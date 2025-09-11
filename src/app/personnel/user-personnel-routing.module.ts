import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPersonnelComponent } from '../personnel/dashboard-personnel/dashboard-personnel';
import { LeaveRequestComponent } from './leave-request/leave-request';
import { ExpenseReportComponent } from './expense-report/expense-report';
import { PersonnelSettingsComponent } from './personnel-settings/personnel-settings';
import { PersonnelGuard } from '../guards/personnel.guard';

const routes: Routes = [
  { path: '', component: DashboardPersonnelComponent, canActivate: [PersonnelGuard] },
  { path: 'leave-request', component: LeaveRequestComponent, canActivate: [PersonnelGuard] },
  { path: 'expense-report', component: ExpenseReportComponent, canActivate: [PersonnelGuard] },
  { path: 'settings', component: PersonnelSettingsComponent, canActivate: [PersonnelGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonnelRoutingModule {}
