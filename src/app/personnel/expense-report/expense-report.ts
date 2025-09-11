import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-report',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './expense-report.html',
  styleUrls: ['./expense-report.css']
})
export class ExpenseReportComponent {
  expense = { date: '', amount: 0, note: '' };
  submitExpense() {
    console.log('Gider gönderildi:', this.expense);
    alert('Gider gönderildi!');
    this.expense = { date: '', amount: 0, note: '' };
  }
}
