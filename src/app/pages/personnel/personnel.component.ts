import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonnelService } from '../../services/personnel.service';
import { Personnel } from '../../models/personnel.model';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personnel.html',
  styleUrls: ['./personnel.css']
})
export class PersonnelComponent implements OnInit {

  personnelList: Personnel[] = [];
  isCardVisible = false;
  selectedPersonnel: Personnel | null = null;

  showAddForm = false;
  newPersonnel: Personnel = this.getEmptyPersonnel();

  constructor(private personnelService: PersonnelService) {}

  ngOnInit() {
    this.loadPersonnel();
  }

  loadPersonnel() {
    this.personnelService.getPersonnelList().subscribe(data => {
      this.personnelList = data;
    });
  }

  openDetails(person: Personnel) {
    this.selectedPersonnel = person;
    this.isCardVisible = true;
  }

  closeDetails() {
    this.isCardVisible = false;
    this.selectedPersonnel = null;
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  addPersonnel() {
    if (!this.newPersonnel.firstName || !this.newPersonnel.lastName) return;
    this.personnelService.addPersonnel({ ...this.newPersonnel });
    this.loadPersonnel();
    this.showAddForm = false;
    this.resetForm();
  }

  deletePersonnel(id: number) {
    this.personnelService.deletePersonnel(id);
    this.loadPersonnel();
    this.closeDetails();
  }

  resetForm() {
    this.newPersonnel = this.getEmptyPersonnel();
  }

  // 📌 Fotoğraf seçimi
  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newPersonnel.personnelphoto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  private getEmptyPersonnel(): Personnel {
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
      personnelphoto: 'assets/images/1f93e380-509a-477b-a3d1-f36894aa28a5.jpg', // varsayılan
    };
  }
}
