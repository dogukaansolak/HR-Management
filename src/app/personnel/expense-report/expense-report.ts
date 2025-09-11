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
  file: File | null = null;

  submitExpense() {
    console.log('Gider gönderildi:', this.expense, 'Dosya:', this.file);
    alert('Gider gönderildi!');
    this.expense = { date: '', amount: 0, note: '' };
    this.file = null;
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type.startsWith('image/') || 
        selectedFile.type === 'application/pdf'
      ) {
        this.file = selectedFile;
      } else {
        alert('Sadece resim ve PDF dosyaları yükleyebilirsiniz.');
        event.target.value = '';
      }
    }
  }
}
