import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-report',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>Gider Göstergesi Gönder</h2>
    <form (ngSubmit)="submitExpense()">
      <label>Tarih:</label>
      <input type="date" [(ngModel)]="expense.date" name="date" required />
      <label>Tutar:</label>
      <input type="number" [(ngModel)]="expense.amount" name="amount" required />
      <label>Açıklama:</label>
      <textarea [(ngModel)]="expense.note" name="note" rows="3"></textarea>
      <button type="submit">Gönder</button>
    </form>
  `,
  styles: [`
    form { display: flex; flex-direction: column; gap: 12px; max-width: 400px; }
    input, textarea { padding: 6px; border-radius: 6px; border: 1px solid #ccc; }
    button { background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
    button:hover { opacity: 0.9; }
  `]
})
export class ExpenseReportComponent {
  expense = { date: '', amount: 0, note: '' };
  submitExpense() {
    console.log('Gider gönderildi:', this.expense);
    alert('Gider gönderildi!');
    this.expense = { date: '', amount: 0, note: '' };
  }
}
