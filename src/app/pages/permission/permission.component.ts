import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Person } from '../../models/personnel.model';
import { PersonService } from '../../services/personnel.service';
import { LeaveListComponent } from './leaves/leave-list.component';
import { LeaveFormComponent } from './leaves/leave-form.component';
import { Department, DepartmentService } from '../../services/department.service';  

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

  @ViewChild('leaveList') leaveList?: LeaveListComponent;

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.personService.getPersons().subscribe((data: Person[]) => {
      this.personnels = data;
      this.filteredPersonnels = [...data];

      // Backend'den gelen izin bilgilerine göre güncelle
      this.personnels.forEach(p => {
        this.updateWorkingStatus(p);
      });
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

  openPersonPermissions(person: Person) {
    this.selectedPerson = person;
  }

  backToList() {
    this.selectedPerson = null;
  }

  onLeaveCreated() {
    this.leaveList?.load();
    if (this.selectedPerson) this.updateWorkingStatus(this.selectedPerson);
  }

  openEditModal(person: Person) {
    this.selectedPerson = { ...person };
  }

  closeEditModal() {
    this.selectedPerson = null;
  }

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

  // Backend'den gelen izinlere göre çalışıyor mu kontrol et
  updateWorkingStatus(person: Person) {
    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    const isOnLeave = person.leaves?.some(leave =>
      leave.startDate <= today && leave.endDate >= today
    );
    person.workingStatus = isOnLeave ? 'İzinde' : 'Çalışıyor';
  }
}
