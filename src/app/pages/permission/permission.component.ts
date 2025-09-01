import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';        // <-- ngModel için
import { CommonModule } from '@angular/common';      // <-- *ngFor, *ngIf için
import { Permission } from '../../models/permission.model';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './permission.html',
  styleUrls: ['./permission.css']
})
export class PermissionComponent implements OnInit {
  permissions: Permission[] = [];
  filteredPermissions: Permission[] = [];

  searchText: string = '';
  selectedDepartment: string = 'Tümü';

  departments: string[] = ['Tümü', 'Muhasebe', 'İK', 'IT'];

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.permissionService.getPermissions().subscribe(data => {
      this.permissions = data;
      this.filteredPermissions = data;
    });
  }

  filterPermissions() {
    this.filteredPermissions = this.permissions.filter(p => {
      const matchesSearch = p.adSoyad.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDepartment =
        this.selectedDepartment === 'Tümü' || p.departman === this.selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }

  editPermission(permission: Permission) {
    // Burada düzenleme ekranına yönlendirme ya da modal açma yapılabilir
    console.log("Düzenle tıklandı:", permission);
  }
}
