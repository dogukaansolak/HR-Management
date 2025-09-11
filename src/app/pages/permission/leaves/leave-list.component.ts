import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrLeaveService } from '../hr-leave.service'; // Doğru servisi import et!
import { LeaveDto } from '../../../models/leave.model';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.css']
})
export class LeaveListComponent implements OnInit {
  @Input() personId!: number;
  @Output() close = new EventEmitter<void>();

  leaves: LeaveDto[] = [];

  constructor(private hrLeaveService: HrLeaveService) {} // Doğru servisi inject et

  ngOnInit(): void {
    if (this.personId) {
      this.hrLeaveService.getLeavesByPersonId(this.personId).subscribe({
        next: (data: LeaveDto[]) => this.leaves = data,
        error: (err: any) => console.error('İzinler yüklenemedi:', err)
      });
    }
  }

deleteLeave(id: number) {
  if (confirm('Bu izni silmek istediğinize emin misiniz?')) {
    this.hrLeaveService.deleteLeave(id).subscribe({
      next: () => this.ngOnInit(),
      error: (err) => alert('Silme işlemi başarısız: ' + err.message)
    });
  }
}

  onClose() {
    this.close.emit();
  }
}