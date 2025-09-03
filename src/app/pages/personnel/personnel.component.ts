import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../services/personnel.service';
import { Person } from '../../models/personnel.model';
import { HttpClientModule } from '@angular/common/http';
import { Department, DepartmentService } from '../../services/department.service';

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
  departments: Department[] = [];
  isCardVisible = false;
  selectedPersonnel: Person | null = null;
  isEditMode = false;
  showAddForm = false;
  newPersonnel: Person = this.getEmptyPersonnel();
  currentPage = 1;
  itemsPerPage = 8;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private readonly personService: PersonService, private readonly departmentService: DepartmentService) {}

  ngOnInit() {
    this.loadPersonnel();
    this.loadDepartments();
  }

  loadPersonnel() {
    this.personService.getPersons().subscribe(data => {
      this.personnelList = data;
      this.filteredPersonnel = [...this.personnelList];


    });
  }
  loadDepartments() {
    this.departmentService.getDepartments().subscribe(depts => {
      this.departments = depts;
    });
  }

  addPersonnel() {
  this.errorMessage = null;
  this.successMessage = null;

  if (!this.newPersonnel.firstName || !this.newPersonnel.lastName || !this.newPersonnel.departmentId) {
    this.errorMessage = "Ad, Soyad ve Departman ID zorunlu!";
    return;
  }

  const body = {
    firstName: this.newPersonnel.firstName,
    lastName: this.newPersonnel.lastName,
    tcKimlik: this.newPersonnel.tckimlik,
    dogumTarihi: this.newPersonnel.dogumTarihi ? new Date(this.newPersonnel.dogumTarihi).toISOString() : null,
    telNo: this.newPersonnel.telNo,
    email: this.newPersonnel.email,
    position: this.newPersonnel.position,
    workingStatus: this.newPersonnel.workingStatus,
    personnelPhoto: this.newPersonnel.personnelPhoto,
    startDate: this.newPersonnel.startDate ? new Date(this.newPersonnel.startDate).toISOString() : null,
    totalLeave: this.newPersonnel.totalLeave,
    usedLeave: this.newPersonnel.usedLeave,
    departmentId: this.newPersonnel.departmentId
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
      console.log('Giden body:', body); // Debug için!
      console.log('Backend hata:', err);
    }
  });
}

saveDetails() {
  if (!this.selectedPersonnel) return;
  this.personService.updatePerson(this.selectedPersonnel).subscribe({
    next: () => {
      this.successMessage = "Personel güncellendi.";
      this.loadPersonnel();
      this.isEditMode = false;
      this.isCardVisible = false;
    },
    error: (err) => {
      this.errorMessage = "Güncelleme hatası: " + (err.error?.message || err.message || "Bilinmeyen hata");
    }
  });
}

deletePersonnel(id: number) {
  if (!confirm("Bu personeli silmek istediğinize emin misiniz?")) {
    return;
  }
  this.personService.deletePerson(id).subscribe({
    next: () => {
      this.successMessage = "Personel silindi.";
      this.loadPersonnel();
      this.closeDetails();
    },
    error: (err) => {
      this.errorMessage = "Silme hatası: " + (err.error?.message || err.message || "Bilinmeyen hata");
    }
  });
}

filterPersonnel() {
  this.filteredPersonnel = this.personnelList.filter(person => {
    const matchesName = (person.firstName + ' ' + person.lastName).toLowerCase().includes(this.searchText.toLowerCase());
    const matchesDept = this.selectedDepartment
      ? person.departmentId === Number(this.selectedDepartment)
      : true;
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
      departmentId: 0 // <-- EKLENDİ!
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