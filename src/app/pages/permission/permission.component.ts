import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonnelService } from '../../services/personnel.service';
import { Personnel } from '../../models/personnel.model';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permission.html',
  styleUrls: ['./permission.css']
})
export class Permission implements OnInit {

  personnelList: Personnel[] = [];
  filteredPersonnel: Personnel[] = [];

  searchText: string = '';
  selectedDepartment: string = '';
  departments: string[] = [];

  constructor(private personnelService: PersonnelService) {}

  ngOnInit() {
    this.loadPersonnel();
  }

  // 🔹 Personel bilgilerini yükle
  loadPersonnel() {
    this.personnelService.getPersonnelList().subscribe(data => {
      this.personnelList = data;
      this.filteredPersonnel = [...this.personnelList];

      this.departments = Array.from(new Set(
        this.personnelList
          .map(p => p.department)
          .filter((dept): dept is string => !!dept)
      ));
    });
  }

  // 🔹 Filtreleme
  filterPersonnel() {
    this.filteredPersonnel = this.personnelList.filter(person => {
      const matchesName = (person.firstName + ' ' + person.lastName)
        .toLowerCase()
        .includes(this.searchText.toLowerCase());
      const matchesDept = this.selectedDepartment ? person.department === this.selectedDepartment : true;
      return matchesName && matchesDept;
    });
  }

  // 🔹 Çalışma süresi hesaplama
  calculateWorkDuration(startDate?: string): string {
  if (!startDate) return "—";
  const start = new Date(startDate);
  const today = new Date();
  const diffTime = today.getTime() - start.getTime();

  const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));

  if (years > 0) {
    return `${years} yıl ${months} ay`;
  } else {
    return `${months} ay`;
  }
}

}
