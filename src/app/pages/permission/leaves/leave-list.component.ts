import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../../services/leave.service';
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

  constructor(private leaveService: LeaveService) {}

ngOnInit(): void {
  this.loadLeaves();
}

loadLeaves() {
  this.leaveService.getMyLeaves().subscribe({
    next: (data: any) => this.leaves = data,
    error: (err: any) => console.error('İzinler yüklenemedi:', err)
  });
}


  deleteLeave(id: number) {
    if (confirm('Bu izni silmek istediğinize emin misiniz?')) {
      this.leaveService.deleteLeave(id).subscribe({ next: () => this.loadLeaves() });
    }
  }

  onClose() {
    this.close.emit();
  }
}
