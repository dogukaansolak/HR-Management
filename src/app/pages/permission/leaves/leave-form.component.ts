import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() leaveCreated = new EventEmitter<void>(); // <- burada event

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

    const payload = {
      EmployeeId: this.personId, // PascalCase
      LeaveType: this.newLeave.leaveType || '',
      StartDate: this.newLeave.startDate || '',
      EndDate: this.newLeave.endDate || '',
      Reason: this.newLeave.reason || '',
      Status: this.newLeave.status || 'Pending'
    };

    this.leaveService.createLeave(payload as unknown as Leave).subscribe({
      next: () => {
        alert('İzin başarıyla eklendi!');
        this.leaveCreated.emit();  // <- parent component'e bildir
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
