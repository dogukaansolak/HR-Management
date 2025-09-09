import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService, LeaveDto } from '../../../services/leave.service';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.css']
})
export class LeaveListComponent {
  @Input() personId!: number;
  leaves: LeaveDto[] = [];

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.leaveService.getAll().subscribe({
      next: data => {
        this.leaves = data.filter(l => l.employeeId === this.personId);
      },
      error: err => console.error('Leave load error:', err)
    });
  }

  deleteLeave(id: number) {
    this.leaveService.delete(id).subscribe({
      next: () => this.load(),
      error: err => console.error('Leave delete error:', err)
    });
  }
}
