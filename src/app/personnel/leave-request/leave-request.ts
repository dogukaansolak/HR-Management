import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';


@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>İzin Talebi Gönder</h2>
    <form (ngSubmit)="submitLeave()" #leaveForm="ngForm">
      <label>Başlangıç Tarihi:</label>
      <input type="date" [(ngModel)]="leave.start" name="start" required />
      <label>Bitiş Tarihi:</label>
      <input type="date" [(ngModel)]="leave.end" name="end" required />
      <label>İzin Türü:</label>
      <select [(ngModel)]="leave.leaveType" name="leaveType" required>
        <option value="Yıllık">Yıllık</option>
        <option value="Hastalık">Hastalık</option>
        <option value="Mazeret">Mazeret</option>
      </select>
      <label>Açıklama:</label>
      <textarea [(ngModel)]="leave.reason" name="reason" rows="3"></textarea>
      <button type="submit">Gönder</button>
    </form>
  `
})
export class LeaveRequestComponent {
  leave = { start: '', end: '', leaveType: 'Yıllık', reason: '' };

  constructor(private leaveService: LeaveService) {}

  submitLeave() {
    // Mapping: Formdan API'ye uygun DTO
    const payload = {
      leaveType: this.leave.leaveType,
      startDate: this.leave.start,
      endDate: this.leave.end,
      reason: this.leave.reason
    };

    this.leaveService.createLeave(payload).subscribe({
      next: (res) => {
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