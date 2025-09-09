import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PermissionComponent } from './permission.component'; // doğru isim ve yol

@NgModule({
  imports: [
    CommonModule,
    PermissionComponent // Standalone component
  ],
  providers: [DatePipe] // DatePipe servisini ekle
})
export class PermissionModule { }
