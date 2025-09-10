import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../../services/leave.service';
import { CreateLeaveDto } from '../../../models/leave.model';

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

  newLeave: CreateLeaveDto = { leaveType: '', startDate: '', endDate: '', reason: '' };

  constructor(private leaveService: LeaveService) { }

  saveLeave() {
    const payload: CreateLeaveDto = {
      leaveType: this.newLeave.leaveType,
      startDate: new Date(this.newLeave.startDate).toISOString(),
      endDate: new Date(this.newLeave.endDate).toISOString(),
      reason: this.newLeave.reason
    };


    this.leaveService.createLeave(payload).subscribe({
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
