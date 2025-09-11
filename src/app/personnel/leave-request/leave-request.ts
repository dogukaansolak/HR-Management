import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="leave-form-container">
      <h2>İzin Talebi Gönder</h2>
      <form (ngSubmit)="submitLeave()" #leaveForm="ngForm" class="leave-form">
        <div class="form-group">
          <label for="start">Başlangıç Tarihi</label>
          <input type="date" id="start" [(ngModel)]="leave.start" name="start" required />
        </div>
        <div class="form-group">
          <label for="end">Bitiş Tarihi</label>
          <input type="date" id="end" [(ngModel)]="leave.end" name="end" required />
        </div>
        <div class="form-group">
          <label for="leaveType">İzin Türü</label>
          <select id="leaveType" [(ngModel)]="leave.leaveType" name="leaveType" required>
            <option value="Yıllık">Yıllık</option>
            <option value="Hastalık">Hastalık</option>
            <option value="Mazeret">Mazeret</option>
          </select>
        </div>
        <div class="form-group">
          <label for="reason">Açıklama</label>
          <textarea id="reason" [(ngModel)]="leave.reason" name="reason" rows="3"></textarea>
        </div>
        <button type="submit">Gönder</button>
      </form>
    </div>
  `,
  styles: [`
    .leave-form-container {
      max-width: 400px;
      margin: 40px auto;
      background: #fff;
      box-shadow: 0 8px 32px 0 rgba(135, 99, 31, 0.17);
      border-radius: 16px;
      padding: 32px 24px 24px 24px;
      font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
    }
    .leave-form-container h2 {
      text-align: center;
      margin-bottom: 24px;
      color: #ff4d00;
      letter-spacing: 1px;
    }
    .leave-form .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 18px;
    }
    .leave-form label {
      margin-bottom: 6px;
      font-weight: 600;
      color: #333;
      font-size: 15px;
      letter-spacing: 0.3px;
    }
    .leave-form input,
    .leave-form select,
    .leave-form textarea {
      padding: 8px 10px;
      border: 1px solid #bdbdbd;
      border-radius: 7px;
      font-size: 15px;
      transition: border 0.2s;
      outline: none;
      background: #f9fafb;
    }
    .leave-form input:focus,
    .leave-form select:focus,
    .leave-form textarea:focus {
      border-color: #ff4d00;
      background: #f1f7fd;
    }
    .leave-form button {
      width: 100%;
      background: linear-gradient(90deg, #ff4d00 60%, #ff4d00 100%);
      color: #fff;
      border: none;
      padding: 12px 0;
      border-radius: 8px;
      font-size: 17px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 8px;
      box-shadow: 0 2px 6px 0 rgba(30,136,229,0.12);
      transition: background 0.2s, box-shadow 0.2s;
    }
    .leave-form button:hover {
      background: linear-gradient(90deg, #ff4d00 60%, #ff4d00 100%);
      box-shadow: 0 6px 16px 0 rgba(30,136,229,0.16);
      opacity: 0.94;
    }
  `]
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