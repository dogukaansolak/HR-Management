import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../services/personnel.service';
import { Person } from '../../models/personnel.model';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personnel.html',
  styleUrls: ['./personnel.css']
})
export class PersonnelComponent implements OnInit {

  personnelList: Person[] = [];
  filteredPersonnel: Person[] = [];

  searchText: string = '';
  selectedDepartment: string = '';
  departments: string[] = [];

  isCardVisible = false;
  selectedPersonnel: Person | null = null;
  isEditMode: boolean = false;

  showAddForm = false;
  newPersonnel: Person = this.getEmptyPersonnel();

  constructor(private readonly personService: PersonService) { }

  ngOnInit() {
    this.loadPersonnel();
  }

  editDetails(person: Person | null) {
    if (!person) return;
    this.selectedPersonnel = person;
    this.isEditMode = true;
  }

  saveDetails() {
    if (!this.selectedPersonnel) return;

    const index = this.personnelList.findIndex(p => p.id === this.selectedPersonnel!.id);
    if (index !== -1) {
      this.personnelList[index] = { ...this.selectedPersonnel };
    }

    this.isEditMode = false;
    this.isCardVisible = false;
  }

  loadPersonnel() {
    this.personService.getPersons().subscribe(data => {
      this.personnelList = data;
      this.filteredPersonnel = [...this.personnelList];

      this.departments = Array.from(new Set(
        this.personnelList
          .map(p => p.department)
          .filter((dept): dept is string => dept !== undefined && dept !== null && dept !== '')
      ));
    });
  }

  filterPersonnel() {
    this.filteredPersonnel = this.personnelList.filter(person => {
      const matchesName = (person.firstName + ' ' + person.lastName).toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDept = this.selectedDepartment ? person.department === this.selectedDepartment : true;
      return matchesName && matchesDept;
    });

    this.currentPage = 1; // Filtre değişince sayfayı 1 yap
  }


  openDetails(person: Person) {
    this.selectedPersonnel = person;
    this.isCardVisible = true;
    this.isEditMode = false;
  }

  closeDetails() {
    this.isCardVisible = false;
    this.selectedPersonnel = null;
    this.isEditMode = false;
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  addPersonnel() {
    if (!this.newPersonnel.firstName || !this.newPersonnel.lastName) return;
    this.personService.addPerson({ ...this.newPersonnel });
    this.loadPersonnel();
    this.showAddForm = false;
    this.resetForm();
  }

  deletePersonnel(id: number) {
    this.personService.deletePerson(id);
    this.loadPersonnel();
    this.closeDetails();
  }

  resetForm() {
    this.newPersonnel = this.getEmptyPersonnel();
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Sadece fotoğraf formatındaki dosyalar yüklenebilir.");
        event.target.value = ''; // input’u sıfırla
        return;
      }

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


  private getEmptyPersonnel(): Person {
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

      // EKLE

    };
  }
  currentPage: number = 1;
  itemsPerPage: number = 8;

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
