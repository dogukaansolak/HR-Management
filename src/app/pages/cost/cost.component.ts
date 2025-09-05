import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Person, ExpenseHistory } from '../../models/personnel.model';
import { PersonService } from '../../services/personnel.service';

@Component({
  selector: 'app-cost',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cost.html',
  styleUrls: ['./cost.css']
})
export class CostComponent implements OnInit {
  personnelList: Person[] = [];
  filteredPersonnel: Person[] = [];
  searchText = '';
  selectedDepartment = '';
  departments: string[] = [];

  selectedPersonnel: Partial<Person & { expenseHistory: ExpenseHistory[] }> | null = null;
  isHistoryModalOpen = false;
  selectedHistoryPerson: Person & { expenseHistory: ExpenseHistory[] } | null = null;

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.personService.getPersons().subscribe((data: Person[]) => {
      this.personnelList = data.map(p => ({
        ...p,
        salary: p.salary || 0,
        mealCost: p.mealCost || 0,
        transportCost: p.transportCost || 0,
        otherCost: p.otherCost || 0,
        expenseHistory: p.expenseHistory || []
      }));
      this.filteredPersonnel = [...this.personnelList];

      this.departments = Array.from(
        new Set(
          this.personnelList
            .map(p => p.departmentName)
            .filter((d): d is string => !!d)
        )
      );
    });
  }

  filterPersonnels() {
    this.filteredPersonnel = this.personnelList.filter(p => {
      const matchesSearch = (p.firstName + ' ' + p.lastName).toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDepartment = this.selectedDepartment ? p.departmentName === this.selectedDepartment : true;
      return matchesSearch && matchesDepartment;
    });
  }

  getTotalCost(person: Person): number {
    return (person.salary || 0) + (person.mealCost || 0) + (person.transportCost || 0) + (person.otherCost || 0);
  }

  getCompanyTotalCost(): number {
    return this.filteredPersonnel.reduce((sum, p) => sum + this.getTotalCost(p), 0);
  }

  openEditModal(person: Person) {
    this.selectedPersonnel = {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      departmentName: person.departmentName,
      salary: 0,
      mealCost: 0,
      transportCost: 0,
      otherCost: 0
    };
  }

  closeEditModal() {
    this.selectedPersonnel = null;
  }

   saveEdit() {
  if (!this.selectedPersonnel) return;

  const person = this.personnelList.find(p => p.id === this.selectedPersonnel!.id);
  if (person) {
    // Masrafları güncelle
    person.salary = (person.salary || 0) + (this.selectedPersonnel.salary || 0);
    person.mealCost = (person.mealCost || 0) + (this.selectedPersonnel.mealCost || 0);
    person.transportCost = (person.transportCost || 0) + (this.selectedPersonnel.transportCost || 0);
    person.otherCost = (person.otherCost || 0) + (this.selectedPersonnel.otherCost || 0);

    // expenseHistory ekle
    if (!person.expenseHistory) person.expenseHistory = [];
    const totalNewExpense = (this.selectedPersonnel.salary || 0) +
                            (this.selectedPersonnel.mealCost || 0) +
                            (this.selectedPersonnel.transportCost || 0) +
                            (this.selectedPersonnel.otherCost || 0);
    if (totalNewExpense > 0) {
      person.expenseHistory.push({ amount: totalNewExpense, date: new Date() });
    }

    // filteredPersonnel içinde değişikliği bildir
    const idx = this.filteredPersonnel.findIndex(p => p.id === person.id);
    if (idx !== -1) {
      this.filteredPersonnel[idx] = { ...person };
    }
  }

  this.closeEditModal();
}


  openHistoryModal(person: Person) {
    this.selectedHistoryPerson = { ...person, expenseHistory: [...(person.expenseHistory || [])] };
    this.isHistoryModalOpen = true;
  }

  closeHistoryModal() {
    this.selectedHistoryPerson = null;
    this.isHistoryModalOpen = false;
  }

  openSelectedHistory() {
    if (!this.selectedPersonnel?.id) return;
    const person = this.personnelList.find(p => p.id === this.selectedPersonnel!.id);
    if (person) this.openHistoryModal(person);
  }

  updateHistoryAmount(index: number, amount: number) {
    if (!this.selectedHistoryPerson?.expenseHistory) return;

    this.selectedHistoryPerson.expenseHistory[index].amount = amount;

    const originalPerson = this.personnelList.find(p => p.id === this.selectedHistoryPerson!.id);
    if (originalPerson?.expenseHistory) {
      originalPerson.expenseHistory[index].amount = amount;

      const idx = this.filteredPersonnel.findIndex(p => p.id === originalPerson.id);
      if (idx !== -1) {
        this.filteredPersonnel[idx] = { ...originalPerson };
        this.filteredPersonnel = [...this.filteredPersonnel];
      }
    }
  }

  deleteHistory(index: number) {
  if (!this.selectedHistoryPerson) return;

  const person = this.personnelList.find(p => p.id === this.selectedHistoryPerson!.id);
  if (!person || !person.expenseHistory) return;

  // Geçmiş ve ana listeyi sil
  person.expenseHistory.splice(index, 1);
  this.selectedHistoryPerson.expenseHistory.splice(index, 1);

  // filteredPersonnel’deki ilgili kişiyi güncelle
  const idx = this.filteredPersonnel.findIndex(p => p.id === person.id);
  if (idx !== -1) {
    this.filteredPersonnel[idx] = { ...person };
  }
}


  trackById(index: number, item: Person) {
    return item.id;
  }
}
