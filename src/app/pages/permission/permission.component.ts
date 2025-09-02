import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Person } from '../../models/personnel.model';
import { PersonService } from '../../services/personnel.service';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './permission.html',
  styleUrls: ['./permission.css']
})
export class PermissionComponent implements OnInit {
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
      this.personnels = data;
      this.filteredPersonnels = [...data];
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
      // Backend'e kaydetme işlemi yapılabilir
      console.log('Kaydedilen personel:', this.selectedPerson);

      const index = this.personnels.findIndex(p => p.id === this.selectedPerson!.id);
      if (index > -1) {
        this.personnels[index] = { ...this.selectedPerson };
        this.filterPersonnels();
      }

      this.closeEditModal();
    }
  }
}
