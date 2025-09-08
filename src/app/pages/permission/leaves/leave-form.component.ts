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

  private toIsoDate(dateStr?: string): string | undefined {
    if (!dateStr) return undefined;
    try {
      const iso = new Date(dateStr).toISOString();
      return iso;
    } catch {
      return undefined;
    }
  }

  saveLeave() {
    if (!this.personId) return;

    // .NET backend often expects PascalCase keys
    const payload = {
      employeeId: this.personId,
      leaveType: this.newLeave.leaveType || '',
      startDate: this.toIsoDate(this.newLeave.startDate) || this.newLeave.startDate || '',
      endDate: this.toIsoDate(this.newLeave.endDate) || this.newLeave.endDate || '',
      reason: this.newLeave.reason || '',
      status: this.newLeave.status || 'Pending'
    };

    this.leaveService.createLeave(payload as unknown as Leave).subscribe({
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
