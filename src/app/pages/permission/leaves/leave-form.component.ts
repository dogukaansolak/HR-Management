import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent implements OnInit {
  @Input() personId!: number;
  @Output() leaveCreated = new EventEmitter<void>();

  leave = {
    startDate: '',
    endDate: '',
    reason: ''
  };

  personLeaves: any[] = []; // mevcut izinler

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    if (this.personId) {
      this.loadPersonLeaves();
    }
  }

  loadPersonLeaves() {
    this.leaveService.getLeavesByPerson(this.personId).subscribe((res: any[]) => {
      this.personLeaves = res;
    });
  }

  submitLeave() {
    if (!this.leave.startDate || !this.leave.endDate) {
      alert('Lütfen başlangıç ve bitiş tarihini seçiniz.');
      return;
    }

    // Tarih çakışmasını kontrol et
    const overlap = this.personLeaves.some(l =>
      (this.leave.startDate <= l.endDate && this.leave.endDate >= l.startDate)
    );

    if (overlap) {
      alert('Bu tarihler arasında zaten izin bulunuyor.');
      return;
    }

    // Kaydet
    this.leaveService.createLeave(this.personId, this.leave).subscribe({
      next: () => {
        this.leaveCreated.emit(); // ✅ parent component (PermissionComponent) bilgilendirilir
        this.leave = { startDate: '', endDate: '', reason: '' }; // form sıfırlanır
        this.loadPersonLeaves(); // yeni izinleri getir
      },
      error: err => {
        console.error('İzin kaydedilemedi', err);
      }
    });
  }
}
