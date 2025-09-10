import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>İzin Talebi Gönder</h2>
    <form (ngSubmit)="submitLeave()">
      <label>Başlangıç Tarihi:</label>
      <input type="date" [(ngModel)]="leave.start" name="start" required />
      <label>Bitiş Tarihi:</label>
      <input type="date" [(ngModel)]="leave.end" name="end" required />
      <label>Açıklama:</label>
      <textarea [(ngModel)]="leave.reason" name="reason" rows="3"></textarea>
      <button type="submit">Gönder</button>
    </form>
  `,
  styles: [`
    form { display: flex; flex-direction: column; gap: 12px; max-width: 400px; }
    input, textarea { padding: 6px; border-radius: 6px; border: 1px solid #ccc; }
    button { background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
    button:hover { opacity: 0.9; }
  `]
})
export class LeaveRequestComponent {
  leave = { start: '', end: '', reason: '' };
  submitLeave() {
    console.log('İzin talebi gönderildi:', this.leave);
    alert('İzin talebi gönderildi!');
    this.leave = { start: '', end: '', reason: '' };
  }
}
