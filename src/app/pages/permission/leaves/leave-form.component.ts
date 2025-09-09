import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';
import { CreateLeaveDto, LeaveDto } from '../../../models/leave.model';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent implements OnInit {
  @Input() personId!: number;               // dışarıdan gelecek
  @Output() saved = new EventEmitter<void>(); // başarıdan sonra parent’a haber ver

  leaveForm!: FormGroup;

  constructor(private fb: FormBuilder, private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      LeaveType: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate:   ['', Validators.required],
      Reason:    ['', Validators.required],
      Status:    ['Pending', Validators.required]
    });
  }

  saveLeave(): void {
    if (this.leaveForm.invalid || !this.personId) return;

    const dto: CreateLeaveDto = {
      EmployeeId: this.personId,
      LeaveType:  this.leaveForm.value.LeaveType,
      StartDate:  this.leaveForm.value.StartDate,
      EndDate:    this.leaveForm.value.EndDate,
      Reason:     this.leaveForm.value.Reason,
      Status:     this.leaveForm.value.Status
    };

    this.leaveService.createLeave(dto).subscribe({
      next: () => {
        this.leaveForm.reset({ Status: 'Pending' });
        this.saved.emit(); // listeyi yeniletmek için
      },
      error: (err) => console.error('İzin kaydı hatası:', err)
    });
  }
}
