import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './leave-request.html',
  styleUrls: ['./leave-request.css']
})
export class LeaveRequestComponent {
  leave = { start: '', end: '', leaveType: 'Yıllık', reason: '' };

  constructor(private leaveService: LeaveService) {}

  submitLeave() {
    const payload = {
      leaveType: this.leave.leaveType,
      startDate: this.leave.start,
      endDate: this.leave.end,
      reason: this.leave.reason
    };

    this.leaveService.createLeave(payload).subscribe({
      next: () => {
        alert('İzin talebi başarıyla gönderildi!');
        this.leave = { start: '', end: '', leaveType: 'Yıllık', reason: '' };
      },
      error: (err) => {
        alert('İzin talebi gönderilirken hata oluştu!');
        console.error(err);
      }
    });
  }
}