import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../../services/leave.service';
import { Leave } from '../../../models/leave.model';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-list.component.html',
})
export class LeaveListComponent implements OnInit {
  @Input() personId!: number;
  leaves: Leave[] = [];

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.leaveService.getLeaves().subscribe({
      next: (data: Leave[]) => {
        this.leaves = this.personId
          ? data.filter(l => l.employeeId === this.personId)
          : data;
      },
      error: (err) => {
        console.error('İzinler yüklenemedi:', err);
      }
    });
  }

  deleteLeave(id: number) {
    if (confirm('Bu izni silmek istediğinize emin misiniz?')) {
      this.leaveService.deleteLeave(id).subscribe({
        next: () => {
          this.load();
        },
        error: (err) => {
          console.error('Silme işlemi başarısız:', err);
        }
      });
    }
  }
}
