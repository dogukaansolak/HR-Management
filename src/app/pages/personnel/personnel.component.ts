import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../services/personnel.service';
import { Person } from '../../models/personnel.model';
import { HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Department, DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgIf, NgFor],
  templateUrl: './personnel.html',
  styleUrls: ['./personnel.css']
})
export class PersonnelComponent implements OnInit , OnDestroy {
  personnelList: Person[] = [];
  filteredPersonnel: Person[] = [];
  searchText = '';
  selectedDepartment: number | '' = '';
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

  // ✅ Yeni alanlar
  showDeleteConfirm = false;
  deleteId: number | null = null;

   private destroy$ = new Subject<void>();

  constructor(private readonly personService: PersonService, private readonly departmentService: DepartmentService) {}

  ngOnInit() {
    this.loadPersonnel();
    this.loadDepartments();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPersonnel() {
    this.personService.getPersons().pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.personnelList = data;
      this.filteredPersonnel = [...this.personnelList];
    });
  }
  loadDepartments() {
    this.departmentService.getDepartments().pipe(takeUntil(this.destroy$)).subscribe(depts => {
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
      departmentId: this.newPersonnel.departmentId,
      adres: this.newPersonnel.adres
    };

    this.personService.addPerson(body).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.successMessage = "Personel başarıyla eklendi.";
        this.loadPersonnel();
        this.showAddForm = false;
        this.resetForm();
      },
      error: (err) => {
        this.errorMessage = "Ekleme hatası: " + (err.error?.message || err.message || "Bilinmeyen hata");
        console.log('Giden body:', body);
        console.log('Backend hata:', err);
      }
    });
  }

  saveDetails() {
    if (!this.selectedPersonnel) return;

    if (!this.selectedPersonnel.firstName || !this.selectedPersonnel.lastName) {
      this.errorMessage = "Ad ve Soyad boş olamaz!";
      return;
    }

    this.personService.updatePerson(this.selectedPersonnel).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.successMessage = "Personel güncellendi.";
        this.loadPersonnel();         
        this.isEditMode = false;      
        this.isCardVisible = false;   
      },
      error: (err) => {
        this.errorMessage = "Güncelleme hatası: " + (err.error?.message || err.message || "Bilinmeyen hata");
        console.error(err);
      }
    });
  }

  // ✅ Değiştirildi
  deletePersonnel(id: number) {
    this.deleteId = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (!this.deleteId) return;

    this.personService.deletePerson(this.deleteId).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.successMessage = "Personel silindi.";
        this.loadPersonnel();
        this.closeDetails();
      },
      error: (err) => {
        this.errorMessage = "Silme hatası: " + (err.error?.message || err.message || "Bilinmeyen hata");
      }
    });

    this.showDeleteConfirm = false;
    this.deleteId = null;

    //this.cancelDelete();
  }
  private handleSuccess(message: string) {
    this.showMessage(message, 'success');
    this.loadPersonnel(); // Veriyi yenile
  }

  // YENİ: Hata durumlarını yöneten yardımcı fonksiyon
  private handleError(err: any, context: string) {
    const errorMessage = err.error?.message || err.message || "Bilinmeyen bir hata oluştu";
    this.showMessage(`${context} hatası: ${errorMessage}`, 'error');
    console.error(`${context} Hatası:`, err);
  }

  // YENİ: Mesajları gösterip bir süre sonra temizleyen fonksiyon
  private showMessage(message: string, type: 'success' | 'error', duration: number = 4000) {
    if (type === 'success') {
      this.successMessage = message;
      this.errorMessage = null;
    } else {
      this.errorMessage = message;
      this.successMessage = null;
    }

    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, duration);
  }

  // YENİ: Bir önceki adımdan eklediğimiz fonksiyon
  calculateWorkDuration(startDateString: string | Date | undefined): string {
    if (!startDateString) return 'Başlangıç tarihi belirtilmemiş';
    const startDate = new Date(startDateString);
    const today = new Date();
    if (isNaN(startDate.getTime())) return 'Geçersiz tarih formatı';
    if (startDate > today) return 'Henüz başlamadı';

    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();
    let days = today.getDate() - startDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} yıl`);
    if (months > 0) parts.push(`${months} ay`);
    if (days > 0) parts.push(`${days} gün`);
    if (parts.length === 0) return "Bugün başladı";
    return parts.join(', ') + ' çalışıyor';
  }


  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deleteId = null;
  }

  filterPersonnel() {
    const searchTextLower = this.searchText.trim().toLowerCase();
    this.filteredPersonnel = this.personnelList.filter(person => {
      const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
      const matchesName = fullName.includes(searchTextLower);

      const matchesDept =
        this.selectedDepartment === '' || this.selectedDepartment == null
          ? true
          : person.departmentId === this.selectedDepartment;

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
      departmentId: 0
    };
  }

  get paginatedPersonnel(): Person[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPersonnel.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPersonnel.length / this.itemsPerPage);
  }

  
  goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

}
