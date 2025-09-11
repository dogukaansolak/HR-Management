import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonnelGuard } from '../guards/personnel.guard';

// 1. Tüm component'lerinizi import edin.
// "Home" component'i, ana panele girildiğinde gösterilecek varsayılan sayfadır.
// Eğer böyle bir component'iniz yoksa oluşturmanız veya varsayılan olarak
// başka bir sayfayı (örn. LeaveRequestComponent) göstermeniz gerekir.
//import { DashboardPersonnelHomeComponent } from '../personnel/dashboard-personnel-home/dashboard-personnel-home'; 
import { DashboardPersonnelComponent } from '../personnel/dashboard-personnel/dashboard-personnel';
import { LeaveRequestComponent } from './leave-request/leave-request';
import { ExpenseReportComponent } from './expense-report/expense-report';
import { PersonnelSettingsComponent } from './personnel-settings/personnel-settings';


const routes: Routes = [
  {
    // 2. Ana (parent) rotayı oluşturuyoruz. Bu bizim "çerçevemiz".
    path: '',
    component: DashboardPersonnelComponent,
    canActivate: [PersonnelGuard], // Guard'ı sadece burada belirtmek yeterli.
    children: [
      // 3. Diğer tüm sayfaları bu çerçevenin "çocukları" (children) yapıyoruz.
      // Bu sayfa ana ekran olarak ayarlı istersek içini düzenleyip etkinleştirebiliriz birde dashboard-personnel'e ana panel butonu eklenir.
      // { 
      //   path: '', // Ana adrese (/personnel-panel) gelindiğinde bu component gösterilecek.
      //   component: DashboardPersonnelHomeComponent 
      // },
      { 
        path: 'leave-request', // /personnel-panel/leave-request
        component: LeaveRequestComponent 
      },
      { 
        path: 'expense-report', // /personnel-panel/expense-report
        component: ExpenseReportComponent 
      },
      { 
        path: 'settings',       // /personnel-panel/settings
        component: PersonnelSettingsComponent 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonnelRoutingModule {}