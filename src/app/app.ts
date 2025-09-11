import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { LeaveListComponent } from './pages/permission/leaves/leave-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
