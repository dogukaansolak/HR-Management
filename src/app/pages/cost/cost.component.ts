import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Person, ExpenseHistoryWithId } from '../../models/personnel.model';
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

  selectedPersonnel: Partial<Person & { expenseHistory: ExpenseHistoryWithId[], expenseDate: string }> | null = null;
  isHistoryModalOpen = false;
  selectedHistoryPerson: Person & { expenseHistory: ExpenseHistoryWithId[] } | null = null;

  historySearchDate: string = '';
  filteredExpenseHistory: ExpenseHistoryWithId[] = [];
  selectedFiles: File[] = [];

  constructor(private personService: PersonService) { }

  ngOnInit(): void {
    this.loadPersonnel();
  }

  loadPersonnel() {
    this.personService.getPersons().subscribe(data => {
      this.personnelList = data.map(p => ({
        ...p,
        salary: p.salary || 0,
        mealCost: p.mealCost || 0,
        transportCost: p.transportCost || 0,
        otherCost: p.otherCost || 0,
        expenseHistory: (p.expenseHistory ?? []).map(h => ({ ...h, id: h.id! })) as ExpenseHistoryWithId[]
      }));
      this.filteredPersonnel = [...this.personnelList];
      this.departments = Array.from(new Set(this.personnelList.map(p => p.departmentName).filter((d): d is string => !!d)));
    });
  }

  filterPersonnels() {
    this.filteredPersonnel = this.personnelList.filter(p => {
      const matchesSearch = (p.firstName + ' ' + p.lastName).toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDepartment = this.selectedDepartment ? p.departmentName === this.selectedDepartment : true;
      return matchesSearch && matchesDepartment;
    });
  }

  filterHistory() {
    if (!this.selectedHistoryPerson) {
      this.filteredExpenseHistory = [];
      return;
    }
    let history = [...this.selectedHistoryPerson.expenseHistory];
    if (this.historySearchDate) {
      const searchDate = new Date(this.historySearchDate);
      history = history.filter(h => {
        const itemDate = new Date(h.date);
        return itemDate.getFullYear() === searchDate.getFullYear() &&
               itemDate.getMonth() === searchDate.getMonth() &&
               itemDate.getDate() === searchDate.getDate();
      });
    }
    this.filteredExpenseHistory = history;
  }

  openEditModal(person: Person) {
    this.selectedFiles = [];
    const today = new Date().toISOString().split('T')[0];
    this.selectedPersonnel = {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      departmentName: person.departmentName,
      salary: person.salary || 0,
      mealCost: person.mealCost || 0,
      transportCost: person.transportCost || 0,
      otherCost: person.otherCost || 0,
      expenseDate: today,
      expenseHistory: person.expenseHistory ? [...person.expenseHistory] : []
    };
  }

  closeEditModal() { this.selectedPersonnel = null; }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.selectedFiles = Array.from(input.files);
  }

  saveEdit() {
    if (!this.selectedPersonnel || !this.selectedPersonnel.id) return;

    console.log('Kaydet tıklandı:', this.selectedPersonnel);

    const personId = this.selectedPersonnel.id;
    const dto = new FormData();
    dto.append('Salary', (this.selectedPersonnel.salary || 0).toString());
    dto.append('MealCost', (this.selectedPersonnel.mealCost || 0).toString());
    dto.append('TransportCost', (this.selectedPersonnel.transportCost || 0).toString());
    dto.append('OtherCost', (this.selectedPersonnel.otherCost || 0).toString());
    dto.append('ExpenseDate', this.selectedPersonnel.expenseDate!);
    this.selectedFiles.forEach(file => dto.append('Receipts', file));

    this.personService.addExpense(personId, dto).subscribe({
      next: res => {
        console.log('Backend response:', res);

        const person = this.personnelList.find(p => p.id === personId);
        if (person) {
          
          const meal = this.selectedPersonnel!.mealCost || 0;
          const transport = this.selectedPersonnel!.transportCost || 0;
          const other = this.selectedPersonnel!.otherCost || 0;
    
          const total = meal + transport + other;
          
          const newExpense: ExpenseHistoryWithId = {
            id: res.id!,
            amount: total,
            date: new Date(this.selectedPersonnel!.expenseDate!),
            receiptUrls: res.receiptUrls || [],
            // Döküm bilgilerini fişe ekle
            mealCost: meal,
            transportCost: transport,
            otherCost: other
          };

          // Personelin toplam maliyetlerini güncelle
          person.mealCost = (person.mealCost || 0) + meal;
          person.transportCost = (person.transportCost || 0) + transport;
          person.otherCost = (person.otherCost || 0) + other;

          person.expenseHistory = [...(person.expenseHistory ?? []), newExpense];
        }

        this.filterPersonnels();
        this.closeEditModal();
      },
      error: err => console.error('Gider kaydedilemedi:', err)
    });
  }

  deleteHistory(index: number) {
  if (!this.selectedHistoryPerson) return;
  const historyItem = this.filteredExpenseHistory[index];
  if (!historyItem || historyItem.id === undefined) return;

  this.personService.deleteExpense(historyItem.id).subscribe({
    next: () => {
      const person = this.personnelList.find(p => p.id === this.selectedHistoryPerson!.id);
      if (!person) return;

      // Parayı fişteki döküme göre doğru gözlere geri koy
      person.mealCost = (person.mealCost || 0) - (historyItem.mealCost || 0);
      person.transportCost = (person.transportCost || 0) - (historyItem.transportCost || 0);
      person.otherCost = (person.otherCost || 0) - (historyItem.otherCost || 0);
      
      // Kaydı fiş defterinden (expenseHistory) sil
      if (person.expenseHistory) {
        person.expenseHistory = person.expenseHistory.filter(h => h.id !== historyItem.id);
      }
      
      if (this.selectedHistoryPerson?.expenseHistory) {
        this.selectedHistoryPerson.expenseHistory = this.selectedHistoryPerson.expenseHistory.filter(h => h.id !== historyItem.id);
      }

      this.filterPersonnels();
      this.filterHistory();
    },
    error: err => console.error('Gider silme hatası:', err)
  });
}

  openHistoryModal(person: Person) {
    this.selectedHistoryPerson = { ...person, expenseHistory: [...(person.expenseHistory ?? [])] };
    this.isHistoryModalOpen = true;
  }

  closeHistoryModal() {
    this.selectedHistoryPerson = null;
    this.isHistoryModalOpen = false;
  }

  trackById(index: number, item: Person) { return item.id; }

  getTotalCost(person: Person): number {
    return (person.salary || 0) + (person.mealCost || 0) + (person.transportCost || 0) + (person.otherCost || 0);
  }

  getCompanyTotalCost(): number {
    return this.filteredPersonnel.reduce((sum, p) => sum + this.getTotalCost(p), 0);
  }

  openSelectedHistory() {
    if (!this.selectedPersonnel?.id) return;
    const person = this.personnelList.find(p => p.id === this.selectedPersonnel!.id);
    if (person) this.openHistoryModal(person);
  }
}
