import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../../services/leave.service';
import { Leave } from '../../../models/leave.model';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-list.component.html'
})
export class LeaveListComponent implements OnInit {
  @Input() personId!: number;
  leaves: Leave[] = [];

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    if (!this.personId) return;
    this.leaveService.getLeavesByEmployee(this.personId).subscribe(data => {
      this.leaves = data;
    });
  }

  deleteLeave(id: number) {
    if (confirm('Bu izni silmek istediğinize emin misiniz?')) {
      this.leaveService.deleteLeave(id).subscribe(() => {
        this.load();
      });
    }
  }
}
