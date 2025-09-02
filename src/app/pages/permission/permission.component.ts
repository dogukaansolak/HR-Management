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

constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.personService.getPersons().subscribe((data: Person[]) => {
      this.personnels = data;
      this.filteredPersonnels = [...data];
    });
  }

  filterPersonnels() {
    this.filteredPersonnels = this.personnels.filter(p => {
      const matchesSearch = (p.firstName + ' ' + p.lastName).toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDepartment =
        this.selectedDepartment === 'Tümü' || p.departmentName === this.selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }

  editPersonnel(person: Person) {
    console.log("Düzenle tıklandı:", person);
  }
}
