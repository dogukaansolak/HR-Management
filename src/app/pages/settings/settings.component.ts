import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Department interface'ini de import edelim ki kullanabilelim
import { Department, DepartmentService } from '../../services/department.service'; 

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  // Departman Ekleme Formu için değişkenler (Bunlar zaten vardı)
  newDepartmentName: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  // YENİ DEĞİŞKENLER: Departman listesi için
  departments: Department[] = []; // API'den gelen departmanları tutacak dizi
  isLoading: boolean = false;      // Veri yüklenirken spinner göstermek için
  showDepartmentsList: boolean = false; // Listenin görünürlüğünü kontrol etmek için

  constructor(private departmentService: DepartmentService) { }

  // Bu metot zaten vardı ve doğru çalışıyordu
  addDepartment(): void {
    this.successMessage = '';
    this.errorMessage = '';
    if (!this.newDepartmentName || this.newDepartmentName.trim() === '') {
      this.errorMessage = 'Departman adı boş olamaz.';
      return;
    }
    const departmentToCreate = this.newDepartmentName.trim();
    this.departmentService.addDepartment(departmentToCreate).subscribe({
      next: (responseId) => {
        console.log('Departman başarıyla eklendi, yeni ID:', responseId);
        this.successMessage = `"${departmentToCreate}" departmanı başarıyla eklendi.`;
        this.newDepartmentName = '';
        // Başarıyla ekleme yapıldıysa ve liste açıksa, listeyi yenileyelim
        if (this.showDepartmentsList) {
          this.fetchDepartments();
        }
      },
      error: (err) => {
        console.error('Departman eklenirken hata oluştu:', err);
        this.errorMessage = 'Departman eklenirken bir hata oluştu.';
      }
    });
  }

  // YENİ METOT: Departman listesini gösterme/gizleme
  toggleDepartmentsList(): void {
    this.showDepartmentsList = !this.showDepartmentsList;

    // Eğer liste gösterilecekse ve daha önce hiç veri çekilmediyse, API'den veriyi çek
    if (this.showDepartmentsList && this.departments.length === 0) {
      this.fetchDepartments();
    }
  }

  // YENİ METOT: API'den departmanları çeken asıl metot
  fetchDepartments(): void {
    this.isLoading = true; // Yükleme animasyonunu başlat
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data; // Gelen veriyi departments dizisine ata
        console.log('Departmanlar başarıyla çekildi:', data);
        this.isLoading = false; // Yüklemeyi bitir
      },
      error: (err) => {
        console.error('Departmanlar çekilirken hata oluştu:', err);
        this.errorMessage = 'Departmanlar yüklenirken bir hata oluştu.'; // Hata mesajını güncelleyebiliriz
        this.isLoading = false; // Yüklemeyi bitir
      }
    });
  }

  
}