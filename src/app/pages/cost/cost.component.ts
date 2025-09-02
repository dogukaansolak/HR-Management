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

  personnels: Person[] = [];
  filteredPersonnels: Person[] = [];

  searchText: string = '';
  selectedDepartment: string = 'Tümü';
  departments: string[] = ['Tümü', 'Muhasebe', 'İK', 'IT'];

  // Modal için seçilen personel
  selectedPerson: Person | null = null;

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.personService.getPersons().subscribe((data: Person[]) => {
      this.personnels = data.map(p => ({
        ...p,
        salary: p.salary || 0,
        mealCost: p.mealCost || 0,
        transportCost: p.transportCost || 0,
        otherCost: p.otherCost || 0
      }));
      this.filteredPersonnels = [...this.personnels];
    });
  }

  filterPersonnels() {
    this.filteredPersonnels = this.personnels.filter(p => {
      const matchesSearch = (p.firstName + ' ' + p.lastName)
        .toLowerCase()
        .includes(this.searchText.toLowerCase());
      const matchesDepartment =
        this.selectedDepartment === 'Tümü' || p.departmentName === this.selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }

  // Personelin toplam maliyeti
  getTotalCost(person: Person): number {
    return (person.salary || 0) + (person.mealCost || 0) + (person.transportCost || 0) + (person.otherCost || 0);
  }

  // Tüm personellerin toplam maliyeti
  getCompanyTotalCost(): number {
    return this.filteredPersonnels.reduce((sum, p) => sum + this.getTotalCost(p), 0);
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
    if (this.selectedPerson) {
      console.log('Kaydedilen personel masrafları:', this.selectedPerson);

      const index = this.personnels.findIndex(p => p.id === this.selectedPerson!.id);
      if (index > -1) {
        this.personnels[index] = { ...this.selectedPerson };
        this.filterPersonnels();
      }

      this.closeEditModal();
    }
  }
}
