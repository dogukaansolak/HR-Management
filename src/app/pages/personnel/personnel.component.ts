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
    });
  }

addPersonnel() {
  this.errorMessage = null;
  this.successMessage = null;
  // Zorunlu alan kontrolü
  if (!this.newPersonnel.firstName || !this.newPersonnel.lastName) {
    this.errorMessage = "Ad ve Soyad zorunlu!";
    return;
  }
  // Backend DTO ile birebir property adları!
  const body = {
    FirstName: this.newPersonnel.firstName,
    LastName: this.newPersonnel.lastName,
    TCKimlik: this.newPersonnel.tckimlik,
    DogumTarihi: this.newPersonnel.dogumTarihi ? new Date(this.newPersonnel.dogumTarihi).toISOString() : null,
    TelNo: this.newPersonnel.telNo,
    Email: this.newPersonnel.email,
    Position: this.newPersonnel.position,
    WorkingStatus: this.newPersonnel.workingStatus,
    PersonnelPhoto: this.newPersonnel.personnelPhoto,
    StartDate: this.newPersonnel.startDate ? new Date(this.newPersonnel.startDate).toISOString() : null,
    TotalLeave: this.newPersonnel.totalLeave,
    UsedLeave: this.newPersonnel.usedLeave,
    DepartmentId: this.newPersonnel.departmentId ?? 0
  };
  this.personService.addPerson(body).subscribe({
    next: () => {
      this.successMessage = "Personel başarıyla eklendi.";
      this.loadPersonnel();
      this.showAddForm = false;
      this.resetForm();
    },
    error: (err) => {
      this.errorMessage = "Ekleme hatası: " + (err.error?.message || err.message || "Bilinmeyen hata");
    }
  });
}

  saveDetails() {
    if (!this.selectedPersonnel) return;
    this.personService.updatePerson(this.selectedPersonnel).subscribe(() => {
      this.loadPersonnel();
      this.isEditMode = false;
      this.isCardVisible = false;
    });
  }

  deletePersonnel(id: number) {
    this.personService.deletePerson(id).subscribe(() => {
      this.loadPersonnel();
      this.closeDetails();
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
      personnelPhoto: 'assets/images/default.jpg',
      departmentId: 0 // DTO ile uyum için eklendi!
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