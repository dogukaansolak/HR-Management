import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { Person } from '../../models/personnel.model';
import { PersonService } from '../../services/personnel.service';
import { LeaveListComponent } from './leaves/leave-list.component';
import { LeaveFormComponent } from './leaves/leave-form.component';
import { Department, DepartmentService } from '../../services/department.service';

import { LeaveDto } from '../../models/leave.model';
import { NotificationBellComponent } from './notification-bell.component';
import { NotificationPanelComponent } from './notification-panel.component';
import { HrLeaveService } from './hr-leave.service';


@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    LeaveFormComponent, 
    LeaveListComponent, 
    NotificationBellComponent, 
    NotificationPanelComponent,
    NgIf
  ],
  templateUrl: './permission.html',
  styleUrls: ['./permission.css']
})
export class PermissionComponent implements OnInit {
  personnels: Person[] = [];
  filteredPersonnels: Person[] = [];

  selectedPerson: Person | null = null;
  searchText = '';
  selectedDepartment: number | '' = '';
  departments: Department[] = [];
  isModalOpen: boolean = false;
  oldLeavePerson: Person | null = null;

  selectedWorkingStatus: string = '';

  panelOpen = false;
  pendingLeaves: LeaveDto[] = [];

  @ViewChild('leaveList') leaveList?: LeaveListComponent;

  constructor(
    private personService: PersonService,
    private departmentService: DepartmentService,
    private hrLeaveService: HrLeaveService
  ) { }

  ngOnInit(): void {
    this.personService.getPersons().subscribe((data: Person[]) => {
      this.personnels = data;
      this.filteredPersonnels = [...data];
    });
    this.loadDepartments();
    this.fetchPendingLeaves();
  }

  filterPersonnels() {
    const searchTextLower = this.searchText.trim().toLowerCase();

    this.filteredPersonnels = this.personnels.filter(person => {
      const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
      const matchesName = fullName.includes(searchTextLower);

      const matchesDept =
        this.selectedDepartment === '' || this.selectedDepartment == null
          ? true
          : person.departmentId === this.selectedDepartment;

      const matchesWorkingStatus =
        this.selectedWorkingStatus === ''
          ? true
          : person.workingStatus === this.selectedWorkingStatus;

      return matchesName && matchesDept && matchesWorkingStatus;
    });
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe((depts: Department[]) => {
      this.departments = depts;
    });
  }

  openEditModal(person: Person) {
    this.selectedPerson = person;
    this.isModalOpen = true;
    this.oldLeavePerson = null;
  }

  openOldLeavePopup(person: Person) {
    this.oldLeavePerson = person;
    this.isModalOpen = false;
  }

  closeEditModal() {
    this.selectedPerson = null;
    this.isModalOpen = false;
  }

  handleLeaveCreated() {
    this.isModalOpen = false;
    this.selectedPerson = null;

    this.personService.getPersons().subscribe((data: Person[]) => {
      this.personnels = data;
      this.filteredPersonnels = [...data];
    });
  }

  // Bildirim çanı ve paneli için eklenenler:
  togglePanel() {
    this.panelOpen = !this.panelOpen;
    if (this.panelOpen) {
      this.fetchPendingLeaves();
    }
  }

  fetchPendingLeaves() {
    this.hrLeaveService.getPendingLeaves()
      .subscribe(leaves => {
this.pendingLeaves = leaves.filter(l => l.status === 'Beklemede');
      });
  }

  approveLeave(id: number) {
    this.hrLeaveService.approveLeave(id).subscribe(() => {
      this.fetchPendingLeaves();
    });
  }
}