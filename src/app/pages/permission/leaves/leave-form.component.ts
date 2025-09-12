import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HRCreateLeaveDto } from '../../../models/leave.model';
import { HrLeaveService } from '../hr-leave.service';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent {
  @Input() personId!: number;
  @Output() leaveCreated = new EventEmitter<void>();

newLeave = { leaveType: '', startDate: '', endDate: '', reason: '' };

  constructor(private leaveService: HrLeaveService) { }

saveLeave() {
  if (!this.personId) {
    alert('Personel seçilmedi!');
    return;
  }
  const payload: HRCreateLeaveDto = {
    employeeId: this.personId, // <-- Eksik olan buydu!
    leaveType: this.newLeave.leaveType,
    startDate: new Date(this.newLeave.startDate).toISOString(),
    endDate: new Date(this.newLeave.endDate).toISOString(),
    reason: this.newLeave.reason
  };






    this.leaveService.hrcreateLeave(payload).subscribe({
      next: () => {
        alert('İzin başarıyla eklendi!');
        this.leaveCreated.emit();
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert('İzin eklenemedi!');
      }
    });
  }

  private resetForm() {
    this.newLeave = { leaveType: '', startDate: '', endDate: '', reason: '' };
  }
}
