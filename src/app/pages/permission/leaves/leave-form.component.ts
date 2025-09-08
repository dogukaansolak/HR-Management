import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../../services/leave.service';
import { Leave } from '../../../models/leave.model';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent {
  @Input() personId!: number;

  newLeave: Partial<Leave> = {
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'Pending'
  };

  constructor(private leaveService: LeaveService) {}

  saveLeave() {
    if (!this.personId) return;

    const leave: Partial<Leave> = {
      ...this.newLeave,
      employeeId: this.personId,
      startDate: this.newLeave.startDate, // string olarak gönderiyoruz
      endDate: this.newLeave.endDate      // string olarak gönderiyoruz
    };

    this.leaveService.createLeave(leave as Leave).subscribe({
      next: () => {
        alert('İzin başarıyla eklendi!');
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert('İzin eklenemedi!');
      }
    });
  }

  private resetForm() {
    this.newLeave = {
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      status: 'Pending'
    };
  }
}
