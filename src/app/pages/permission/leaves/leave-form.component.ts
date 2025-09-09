import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';
import { LeaveDto } from '../../../models/leave.model';

@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent implements OnInit {
  @Input() personId!: number;
  leaveForm!: FormGroup;
  leave: LeaveDto = {} as LeaveDto;

  constructor(private fb: FormBuilder, private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      LeaveType: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      Reason: ['', Validators.required],
      Status: ['Pending', Validators.required]
    });

    // Leave bilgilerini yükle
    this.loadLeaves();
  }

  loadLeaves() {
    this.leaveService.getAllLeaves().subscribe((leaves: LeaveDto[]) => {
      // Örnek: sadece bu personId'nin izinlerini filtrele
      const filtered = leaves.filter((l: LeaveDto) => l.EmployeeId === this.personId);
      // Burada ihtiyacın olan işleme göre kullanabilirsin
      console.log(filtered);
    });
  }

  saveLeave() {
    if (this.leaveForm.invalid) return;

    // DTO'ya personId ekle
    const dto: LeaveDto = {
      ...this.leaveForm.value,
      EmployeeId: this.personId
    };

    this.leaveService.createLeave(dto).subscribe({
      next: (res) => {
        console.log('İzin kaydedildi', res);
        this.leaveForm.reset({ Status: 'Pending' });
      },
      error: (err) => console.error(err)
    });
  }
}
