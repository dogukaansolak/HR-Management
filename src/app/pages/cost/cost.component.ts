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

  selectedPersonnel: Partial<Person & { expenseHistory: ExpenseHistory[], expenseDate: string }> | null = null;
  isHistoryModalOpen = false;
  selectedHistoryPerson: Person & { expenseHistory: ExpenseHistory[] } | null = null;

   historySearchDate: string = ''; // Tarih input'u için
  filteredExpenseHistory: ExpenseHistory[] = []; // Filtrelenmiş listeyi tutmak için

  selectedFiles: File[] = [];

   onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

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

  filterHistory() {
    if (!this.selectedHistoryPerson) {
      this.filteredExpenseHistory = [];
      return;
    }

    let history = [...this.selectedHistoryPerson.expenseHistory];

    if (this.historySearchDate) {
      // Input'tan gelen 'YYYY-MM-DD' formatındaki tarih
      const searchDate = new Date(this.historySearchDate);
      
      history = history.filter(h => {
        const itemDate = new Date(h.date);
        // İki tarihin de yıl, ay ve gün değerlerini karşılaştır
        return itemDate.getFullYear() === searchDate.getFullYear() &&
               itemDate.getMonth() === searchDate.getMonth() &&
               itemDate.getDate() === searchDate.getDate();
      });
    }

    this.filteredExpenseHistory = history;
  }

  getTotalCost(person: Person): number {
    return (person.salary || 0) + (person.mealCost || 0) + (person.transportCost || 0) + (person.otherCost || 0);
  }

  getCompanyTotalCost(): number {
    return this.filteredPersonnel.reduce((sum, p) => sum + this.getTotalCost(p), 0);
  }

  openEditModal(person: Person) {

    this.selectedFiles = [];

    const today = new Date().toISOString().split('T')[0];

    this.selectedPersonnel = {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      departmentName: person.departmentName,
      salary: 0,
      mealCost: 0,
      transportCost: 0,
      otherCost: 0,
      expenseDate: today
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

    const totalNewExpense = (this.selectedPersonnel.salary || 0) +
                            (this.selectedPersonnel.mealCost || 0) +
                            (this.selectedPersonnel.transportCost || 0) +
                            (this.selectedPersonnel.otherCost || 0);

    // Sadece masraf girildiyse veya sadece fiş eklendiyse bile kaydet
    if (totalNewExpense > 0 || this.selectedFiles.length > 0) {
      if (!person.expenseHistory) person.expenseHistory = [];

      const expenseDate = new Date(this.selectedPersonnel.expenseDate + 'T00:00:00');

      // FİŞ İŞLEME MANTIĞI EKLENDİ 
      const receiptUrls: string[] = [];
      if (this.selectedFiles.length > 0) {
        this.selectedFiles.forEach(file => {
          // NOT: Bu, dosyayı sunucuya yüklemez, sadece tarayıcıda geçici bir adres oluşturur.
          const temporaryUrl = URL.createObjectURL(file);
          receiptUrls.push(temporaryUrl);
        });
      }
      // FİŞ İŞLEME MANTIĞI SONU 

      // expenseHistory'ye fiş URL'lerini de ekleyerek kaydı gönder
      person.expenseHistory.push({
        amount: totalNewExpense,
        date: expenseDate,
        receiptUrls: receiptUrls // Fiş URL'leri eklendi
      });
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

  updateHistoryAmount(index: number, newAmount: number) {
    if (!this.selectedHistoryPerson?.expenseHistory) return;

  // 2. Değiştirilecek olan asıl geçmiş kaydını filtrelenmiş listeden bul
  const historyItemToUpdate = this.filteredExpenseHistory[index];
  if (!historyItemToUpdate) return;
  
  const oldAmount = historyItemToUpdate.amount; // Eski tutarı sakla

  // 3. Ana personel listesindeki ilgili kişiyi bul
  const originalPerson = this.personnelList.find(p => p.id === this.selectedHistoryPerson!.id);
  if (!originalPerson?.expenseHistory) return;

  // 4. Ana listedeki geçmiş kaydının index'ini bul ve tutarı güncelle
  const originalIndex = originalPerson.expenseHistory.findIndex(h => h === historyItemToUpdate);
  if (originalIndex === -1) return;
  
  originalPerson.expenseHistory[originalIndex].amount = newAmount;

  // 5. [MANTIK DÜZELTMESİ] Ana tablodaki toplam maliyeti güncelle
  // Tutar farkını personelin toplam maliyetlerinden birine yansıtıyoruz.
  // Bu örnekte, bu tür çeşitli giderlerin `otherCost` içinde toplandığını varsayıyoruz.
  const difference = newAmount - oldAmount;
  originalPerson.otherCost = (originalPerson.otherCost || 0) + difference;

  // 6. Değişikliğin ekrana yansıması için filtrelenmiş personel listesini güncelle
  this.filterPersonnels();

  // 7. Modal içindeki listenin görünümünü yenile
  this.filterHistory();
  }

  deleteHistory(index: number) {
  if (!this.selectedHistoryPerson) return;
  
  // 2. Silinecek olan asıl geçmiş kaydını filtrelenmiş listeden bul
  const historyItemToDelete = this.filteredExpenseHistory[index];
  if (!historyItemToDelete) return;

  const amountToDelete = historyItemToDelete.amount; // Silinecek tutarı sakla

  // 3. Ana personel listesindeki ilgili kişiyi bul
  const person = this.personnelList.find(p => p.id === this.selectedHistoryPerson!.id);
  if (!person || !person.expenseHistory) return;

  // 4. Ana listedeki geçmiş kaydını sil
  person.expenseHistory = person.expenseHistory.filter(h => h !== historyItemToDelete);
  
  // 5. [MANTIK DÜZELTMESİ] Silinen tutarı personelin toplam maliyetinden düş
  person.otherCost = (person.otherCost || 0) - amountToDelete;

  // 6. Değişikliğin ekrana yansıması için filtrelenmiş personel listesini güncelle
  this.filterPersonnels();

  // 7. Modal içindeki "selectedHistoryPerson" verisini ve görünümü yenile
  this.selectedHistoryPerson.expenseHistory = this.selectedHistoryPerson.expenseHistory.filter(h => h !== historyItemToDelete);
  this.filterHistory();
}


  trackById(index: number, item: Person) {
    return item.id;
  }
}
