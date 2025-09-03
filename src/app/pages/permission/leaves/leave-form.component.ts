import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../../services/leave.service';
import { Leave } from '../../../models/leave.model';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './leave-form.component.html'
})
export class LeaveFormComponent {
  @Input() personId!: number;

  newLeave: Partial<Leave> = {
    leaveType: '',
    startDate: new Date(),
    endDate: new Date(),
    reason: '',
    status: 'Pending'
  };

  constructor(private leaveService: LeaveService) {}

  saveLeave() {
    if (!this.personId) return;

    const leave: Leave = {
      ...this.newLeave,
      id: 0, // backend generate edecek
      employeeId: this.personId,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Leave;

    this.leaveService.createLeave(leave).subscribe(() => {
      alert('İzin eklendi!');
      this.newLeave = {
        leaveType: '',
        startDate: new Date(),
        endDate: new Date(),
        reason: '',
        status: 'Pending'
      };
    });
  }
}
