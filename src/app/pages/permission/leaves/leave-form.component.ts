import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../../services/leave.service';


@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent implements OnInit {
  @Input() personId!: number; // Personel ID parent'tan geliyor
  @Output() leaveCreated = new EventEmitter<void>(); // Yeni izin eklenince parent bilgilendirilecek

  leaveForm!: FormGroup;

  constructor(private fb: FormBuilder, private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      employeeId: [this.personId, Validators.required],
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['']
    });
  }

  saveLeave(): void {
    if (this.leaveForm.invalid) return;

    const leaveData = this.leaveForm.value;

    this.leaveService.create(leaveData).subscribe({
      next: res => {
        console.log('İzin başarıyla kaydedildi:', res);
        this.leaveForm.reset();
        this.leaveCreated.emit(); // Parent component'i bilgilendir
      },
      error: err => {
        console.error('İzin kaydedilemedi:', err);
      }
    });
  }
}
