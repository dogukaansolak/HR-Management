// src/app/pages/permission/permission.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Person } from '../../models/personnel.model';
import { PersonService } from '../../services/personnel.service';
import { LeaveListComponent } from './leaves/leave-list.component';
import { LeaveFormComponent } from './leaves/leave-form.component';
import { DepartmentService } from '../../services/department.service';  
import { NgModule } from '@angular/core';

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

  searchText = '';
  selectedDepartment = 'Tüm Departmanlar';
  departments = ['Tüm Departmanlar'];

  selectedPerson: Person | null = null;

  @ViewChild('leaveList') leaveList?: LeaveListComponent;

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.personService.getPersons().subscribe((data: Person[]) => {
      this.personnels = data;
      this.filteredPersonnels = [...data];
    });
  }

  filterPersonnels() {
    const q = this.searchText?.trim().toLowerCase() ?? '';
    this.filteredPersonnels = this.personnels.filter(p => {
      const full = (p.firstName + ' ' + p.lastName).toLowerCase();
      const matchesSearch = !q || full.includes(q);
      const matchesDept = this.selectedDepartment === 'Tümü' || p.departmentName === this.selectedDepartment;
      return matchesSearch && matchesDept;
    });
  }

  openPersonPermissions(person: Person) {
    this.selectedPerson = person;
  }

  backToList() {
    this.selectedPerson = null;
  }

  // leave-form component'tan gelen event ile list yenilensin
  onLeaveCreated() {
    this.leaveList?.load();
  }

  // Modal aç
openEditModal(person: Person) {
  this.selectedPerson = { ...person };
}

// Modal kapat
closeEditModal() {
  this.selectedPerson = null;
}

// Değişiklikleri kaydet
saveEdit() {
  if (!this.selectedPerson) return;

  // Backend kaydı yapılacak
  console.log('Kaydedilen personel:', this.selectedPerson);

  const index = this.personnels.findIndex(p => p.id === this.selectedPerson!.id);
  if (index > -1) {
    this.personnels[index] = { ...this.selectedPerson };
    this.filterPersonnels();
  }

  this.closeEditModal();
}

}
