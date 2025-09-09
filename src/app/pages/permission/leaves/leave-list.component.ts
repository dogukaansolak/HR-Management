import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';
import { LeaveDto } from '../../../models/leave.model';
import { DateDiffPipe } from '../../../pipes/date-diff.pipe';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe, DateDiffPipe],
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.css']
})
export class LeaveListComponent implements OnInit {
  @Input() personId?: number;

  leaves: LeaveDto[] = [];
  filteredLeaves: LeaveDto[] = [];
  searchText: string = '';
  selectedStatus: string = '';
  showModal: boolean = false;
  leaveForm: FormGroup;
  editingLeaveId: number | null = null;

  constructor(private leaveService: LeaveService, private fb: FormBuilder) {
    this.leaveForm = this.fb.group({
      EmployeeId: ['', Validators.required],
      LeaveType: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      Reason: ['', Validators.required],
      Status: ['Pending', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLeaves();
  }

  load(): void {
    this.loadLeaves();
  }

  async loadLeaves() {
    try {
      if (this.personId) {
        this.leaves = (await this.leaveService.getLeavesByPerson(this.personId).toPromise()) || [];
      } else {
        this.leaves = (await this.leaveService.getAllLeaves().toPromise()) || [];
      }
      this.filteredLeaves = [...this.leaves];
    } catch (error) {
      console.error('Leave yüklenirken hata oluştu:', error);
      this.leaves = [];
      this.filteredLeaves = [];
    }
  }

  filterLeaves() {
    this.filteredLeaves = this.leaves.filter(l =>
      l.EmployeeName.toLowerCase().includes(this.searchText.toLowerCase()) &&
      (this.selectedStatus ? l.Status === this.selectedStatus : true)
    );
  }

  openNewLeaveForm() {
    this.editingLeaveId = null;
    this.leaveForm.reset({ Status: 'Pending', EmployeeId: this.personId || '' });
    this.showModal = true;
  }

  openEditLeaveForm(leave: LeaveDto) {
    this.editingLeaveId = leave.Id;
    this.leaveForm.patchValue({
      EmployeeId: leave.EmployeeId,
      LeaveType: leave.LeaveType,
      StartDate: leave.StartDate,
      EndDate: leave.EndDate,
      Reason: leave.Reason,
      Status: leave.Status
    });
    this.showModal = true;
  }

  async saveLeave() {
    if (this.leaveForm.invalid) return;
    const formValue = this.leaveForm.value;

    if (this.editingLeaveId) {
      await this.leaveService.updateLeave(this.editingLeaveId, formValue).toPromise();
    } else {
      await this.leaveService.createLeave(formValue).toPromise();
    }
    this.showModal = false;
    this.loadLeaves();
  }

  async deleteLeave(id: number) {
    if (!confirm('Bu izni silmek istediğinize emin misiniz?')) return;
    await this.leaveService.deleteLeave(id).toPromise();
    this.loadLeaves();
  }

  closeModal() {
    this.showModal = false;
  }
}
