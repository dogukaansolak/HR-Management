import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonnelService } from '../../services/personnel.service';
import { Personnel } from '../../models/personnel.model';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personnel.html',
  styleUrls: ['./personnel.css']
})
export class PersonnelComponent implements OnInit {

  personnelList: Personnel[] = [];
  filteredPersonnel: Personnel[] = [];

  searchText: string = '';
  selectedDepartment: string = '';
  departments: string[] = [];

  isCardVisible = false;
  selectedPersonnel: Personnel | null = null;
  isEditMode: boolean = false;

  showAddForm = false;
  newPersonnel: Personnel = this.getEmptyPersonnel();

  constructor(private readonly personnelService: PersonnelService) { }

  ngOnInit() {
    this.loadPersonnel();
  }

  // 🔹 Düzenle butonuna basınca
  editDetails(person: Personnel | null) {
    if (!person) return;
    this.selectedPersonnel = { ...person };
    this.isEditMode = true;
  }

  // 🔹 Kaydet butonu
  saveDetails() {
    if (!this.selectedPersonnel) return;

    const index = this.personnelList.findIndex(p => p.id === this.selectedPersonnel!.id);
    if (index !== -1) {
      this.personnelList[index] = { ...this.selectedPersonnel };
    }

    this.isEditMode = false;
    this.isCardVisible = false;
  }

  // 🔹 Personel listesi yükleme
  loadPersonnel() {
    this.personnelService.getPersonnelList().subscribe(data => {
      this.personnelList = data;
      this.filteredPersonnel = [...this.personnelList];

      this.departments = Array.from(new Set(
        this.personnelList
          .map(p => p.department)
          .filter((dept): dept is string => dept !== undefined && dept !== null && dept !== '')
      ));
    });
  }

  // 🔹 Filtreleme
  filterPersonnel() {
    this.filteredPersonnel = this.personnelList.filter(person => {
      const matchesName = (person.firstName + ' ' + person.lastName).toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDept = this.selectedDepartment ? person.department === this.selectedDepartment : true;
      return matchesName && matchesDept;
    });
  }

  // 🔹 Popup açma / kapama
  openDetails(person: Personnel) {
    this.selectedPersonnel = person;
    this.isCardVisible = true;
    this.isEditMode = false; // başta readonly
  }

  closeDetails() {
    this.isCardVisible = false;
    this.selectedPersonnel = null;
    this.isEditMode = false;
  }

  // 🔹 Yeni personel formu
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  addPersonnel() {
    if (!this.newPersonnel.firstName || !this.newPersonnel.lastName) return;
    this.personnelService.addPersonnel({ ...this.newPersonnel });
    this.loadPersonnel();
    this.showAddForm = false;
    this.resetForm();
  }

  deletePersonnel(id: number) {
    this.personnelService.deletePersonnel(id);
    this.loadPersonnel();
    this.closeDetails();
  }

  resetForm() {
    this.newPersonnel = this.getEmptyPersonnel();
  }

  // 🔹 Fotoğraf seçimi (yeni personel için)
  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.showAddForm) {
          this.newPersonnel.personnelphoto = reader.result as string;
        } else if (this.isEditMode && this.selectedPersonnel) {
          this.selectedPersonnel.personnelphoto = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  private getEmptyPersonnel(): Personnel {
    return {
      id: 0,
      firstName: '',
      lastName: '',
      tckimlik: '',
      dogumtarihi: '',
      telno: '',
      adres: '',
      email: '',
      position: '',
      department: '',
      startDate: '',
      totalLeave: 0,
      usedLeave: 0,
      workingStatus: 'Çalışıyor',
      personnelphoto: 'assets/images/1f93e380-509a-477b-a3d1-f36894aa28a5.jpg',
    };
  }
}
