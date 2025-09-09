import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Person } from '../../models/personnel.model';
import { PersonService } from '../../services/personnel.service';
import { LeaveListComponent } from './leaves/leave-list.component';
import { LeaveFormComponent } from './leaves/leave-form.component';
import { Department } from '../../services/department.service';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [FormsModule, CommonModule, LeaveFormComponent, LeaveListComponent],
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

  @ViewChild('leaveList') leaveList?: LeaveListComponent;

  constructor(private personService: PersonService) { }

  ngOnInit(): void {
    this.personService.getPersons().subscribe((data: Person[]) => {
      this.personnels = data;
      this.filteredPersonnels = [...data];
    });
  }

  filterPersonnels() {
    const searchTextLower = this.searchText.trim().toLowerCase();
    this.filteredPersonnels = this.personnels.filter(person => {
      const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
      const matchesName = fullName.includes(searchTextLower);

      const matchesDept = this.selectedDepartment === '' || this.selectedDepartment == null
        ? true
        : person.departmentId === this.selectedDepartment;

      return matchesName && matchesDept;
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
    // Modal kapansın
    this.isModalOpen = false;
    this.selectedPerson = null;

    // Tablodaki veriyi yenile
    this.personService.getPersons().subscribe((data: Person[]) => {
      this.personnels = data;
      this.filteredPersonnels = [...data];
    });
  }
  
}
