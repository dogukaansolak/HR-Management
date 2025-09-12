import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Department, DepartmentService } from '../../services/department.service'; 

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  // --- Değişkenler ---
  newDepartmentName: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  
  departments: Department[] = [];
  isLoading: boolean = false;
  
  // Hangi bölümün gösterileceğini belirleyen durum değişkeni
  // 'none': Hiçbiri, 'add': Ekleme Formu, 'show': Listeleme, 'delete': Silme Listesi
  currentView: 'none' | 'add' | 'show' | 'delete' = 'none';

  constructor(private departmentService: DepartmentService) { }

  /**
   * Görünümü değiştiren ana metot.
   * @param view Gösterilecek olan bölümün adı ('add', 'show', 'delete')
   */
  setView(view: 'none' | 'add' | 'show' | 'delete'): void {
    // Eğer zaten o görünümdeysek veya tekrar aynı butona basıldıysa, görünümü kapat.
    if (this.currentView === view) {
      this.currentView = 'none';
      return;
    }

    this.currentView = view;
    this.successMessage = ''; // Görünüm değiştiğinde mesajları temizle
    this.errorMessage = '';

    // Eğer 'göster' veya 'sil' görünümü açılıyorsa ve departmanlar daha önce çekilmediyse,
    // API'den departmanları çek.
    if ((view === 'show' || view === 'delete') && this.departments.length === 0) {
      this.fetchDepartments();
    }
  }

  /**
   * Yeni bir departman ekler.
   */
  addDepartment(): void {
    this.successMessage = '';
    this.errorMessage = '';
    if (!this.newDepartmentName || this.newDepartmentName.trim() === '') {
      this.errorMessage = 'Departman adı boş olamaz.';
      return;
    }
    const departmentToCreate = this.newDepartmentName.trim();
    this.departmentService.addDepartment(departmentToCreate).subscribe({
      next: () => {
        this.successMessage = `"${departmentToCreate}" departmanı başarıyla eklendi.`;
        this.newDepartmentName = '';
        // Ekleme sonrası listeyi yenilemek için departmanları tekrar çek
        this.fetchDepartments(); 
      },
      error: (err) => {
        console.error('Departman eklenirken hata oluştu:', err);
        this.errorMessage = 'Departman eklenirken bir hata oluştu.';
      }
    });
  }

  /**
   * Belirtilen ID'ye sahip departmanı siler.
   * @param deptId Silinecek departmanın ID'si
   */
  deleteDepartment(deptId: number): void {
    this.departmentService.deleteDepartment(deptId).subscribe({
      next: () => {
        // Silme işlemi başarılı olursa, listeden bu departmanı anında kaldır.
        this.departments = this.departments.filter(d => d.id !== deptId);
        this.successMessage = 'Departman başarıyla silindi.';
      },
      error: (err) => {
        console.error('Departman silinirken hata oluştu:', err);
        this.errorMessage = 'Departman silinirken bir hata oluştu.';
      }
    });
  }

  /**
   * API'den tüm departmanları çeker.
   */
  fetchDepartments(): void {
    this.isLoading = true;
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Departmanlar çekilirken hata oluştu:', err);
        this.errorMessage = 'Departmanlar yüklenirken bir hata oluştu.';
        this.isLoading = false;
      }
    });
  }
}