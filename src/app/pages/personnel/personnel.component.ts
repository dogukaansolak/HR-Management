import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../services/personnel.service';
import { Person } from '../../models/personnel.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './personnel.html',
  styleUrls: ['./personnel.css']
})
export class PersonnelComponent implements OnInit {
saveDetails() {
throw new Error('Method not implemented.');
}
deletePersonnel(arg0: number) {
throw new Error('Method not implemented.');
}
addPersonnel() {
throw new Error('Method not implemented.');
}
  personnelList: Person[] = [];
  filteredPersonnel: Person[] = [];
  searchText = '';
  selectedDepartment = '';
  departments: string[] = [];
  isCardVisible = false;
  selectedPersonnel: Person | null = null;
  isEditMode = false;
  showAddForm = false;
  newPersonnel: Person = this.getEmptyPersonnel();
  currentPage = 1;
  itemsPerPage = 8;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private readonly personService: PersonService) {}

  ngOnInit() {
    this.loadPersonnel();
  }

  loadPersonnel() {
    this.personService.getPersons().subscribe(data => {
      this.personnelList = data;
      this.filteredPersonnel = [...this.personnelList];

      this.departments = Array.from(new Set(
        this.personnelList
          .map(p => p.departmentName)
          .filter((dept): dept is string => dept !== undefined && dept !== null && dept !== '')
      ));
    });
  }

  filterPersonnel() {
    this.filteredPersonnel = this.personnelList.filter(person => {
      const matchesName = (person.firstName + ' ' + person.lastName).toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDept = this.selectedDepartment ? person.departmentName === this.selectedDepartment : true;
      return matchesName && matchesDept;
    });
    this.currentPage = 1;
  }

  openDetails(person: Person) {
    this.selectedPersonnel = { ...person };
    this.isCardVisible = true;
    this.isEditMode = false;
  }

  editDetails(person: Person | null) {
    if (!person) return;
    this.selectedPersonnel = { ...person };
    this.isEditMode = true;
  }

  closeDetails() {
    this.isCardVisible = false;
    this.selectedPersonnel = null;
    this.isEditMode = false;
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) this.resetForm();
  }

  resetForm() {
    this.newPersonnel = this.getEmptyPersonnel();
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Sadece fotoğraf formatındaki dosyalar yüklenebilir.");
        event.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (this.showAddForm) {
          this.newPersonnel.personnelPhoto = reader.result as string;
        } else if (this.isEditMode && this.selectedPersonnel) {
          this.selectedPersonnel.personnelPhoto = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  private getEmptyPersonnel(): Person {
    return {
      id: 0,
      firstName: '',
      lastName: '',
      tckimlik: '',
      dogumTarihi: null,
      telNo: '',
      adres: '',
      email: '',
      position: '',
      departmentName: '',
      startDate: null,
      totalLeave: 0,
      usedLeave: 0,
      workingStatus: 'Çalışıyor',
      personnelPhoto: 'assets/images/1f93e380-509a-477b-a3d1-f36894aa28a5.jpg',

      // EKLE

    };
  }

  get paginatedPersonnel(): Person[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPersonnel.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPersonnel.length / this.itemsPerPage);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
  goToNextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }
}