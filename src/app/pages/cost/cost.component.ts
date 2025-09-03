import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Person } from '../../models/personnel.model';
import { PersonService } from '../../services/personnel.service';

@Component({
  selector: 'app-cost',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cost.html',
  styleUrls: ['./cost.css'] // ✅ styleUrl yerine styleUrls olmalı
})
export class Cost implements OnInit {

  personnelList: Person[] = [];
  filteredPersonnel: Person[] = [];
  searchText = '';
  selectedDepartment = '';
  departments: string[] = [];
  isCardVisible = false;
  selectedPersonnel: Person | null = null;
  isEditMode = false;
  showAddForm = false;
  currentPage = 1;
  itemsPerPage = 8;
  errorMessage: string | null = null;
  successMessage: string | null = null;


  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.personService.getPersons().subscribe((data: Person[]) => {
      this.personnelList = data.map(p => ({
        ...p,
        salary: p.salary || 0,
        mealCost: p.mealCost || 0,
        transportCost: p.transportCost || 0,
        otherCost: p.otherCost || 0
      }));
      this.filteredPersonnel = [...this.personnelList];
    });
  }

  filterPersonnels() {
    this.filteredPersonnel = this.personnelList.filter(p => {
      const matchesSearch = (p.firstName + ' ' + p.lastName).toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDepartment = this.selectedDepartment ? p.departmentName === this.selectedDepartment : true;
      return matchesSearch && matchesDepartment;
    });
    this.currentPage = 1;
  }

  // Personelin toplam maliyeti
  getTotalCost(person: Person): number {
    return (person.salary || 0) + (person.mealCost || 0) + (person.transportCost || 0) + (person.otherCost || 0);
  }

  // Tüm personellerin toplam maliyeti
  getCompanyTotalCost(): number {
    return this.filteredPersonnel.reduce((sum, p) => sum + this.getTotalCost(p), 0);
  }

  // Modal aç
  openEditModal(person: Person) {
    this.selectedPersonnel = { ...person };
  }

  // Modal kapat
  closeEditModal() {
    this.selectedPersonnel = null;
  }

  // Değişiklikleri kaydet
  saveEdit() {
    if (this.selectedPersonnel) {
      console.log('Kaydedilen personel masrafları:', this.selectedPersonnel);

      const index = this.personnelList.findIndex(p => p.id === this.selectedPersonnel!.id);
      if (index > -1) {
        this.personnelList[index] = { ...this.selectedPersonnel };
        this.filterPersonnels();
      }

      this.closeEditModal();
    }
  }
}
