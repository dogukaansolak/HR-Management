import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PermissionComponent } from './permission.component'; 

@NgModule({
  imports: [
    CommonModule,
    PermissionComponent 
  ],
  providers: [DatePipe] 
})
export class PermissionModule { }
