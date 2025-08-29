import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { PermissionComponent } from './permission.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PermissionComponent
    // ...varsa diğer modüller...
    
  ],
  providers: [DatePipe] // DatePipe'ı burada sağlayın
})
export class PermissionModule { }