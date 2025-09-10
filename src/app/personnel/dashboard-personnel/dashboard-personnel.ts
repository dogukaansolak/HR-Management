// src/app/personnel/dashboard-personnel/dashboard-personnel.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-personnel',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Personel Paneli</h1>
    <div class="menu-buttons">
      <button routerLink="/personnel-panel/leave-request">İzin Talebi Gönder</button>
      <button routerLink="/personnel-panel/expense-report">Gider Göstergesi Gönder</button>
      <button routerLink="/personnel-panel/settings">Ayarlar</button>
    </div>
  `,
  styles: [`
    .menu-buttons { display: flex; gap: 16px; margin-top: 20px; }
    button { padding: 12px 20px; border-radius: 10px; border: none; background: linear-gradient(90deg,#FF6A00 0%, #FF9900 100%); color: white; font-weight: 600; cursor: pointer; transition: 0.2s; }
    button:hover { opacity: 0.9; }
  `]
})
export class DashboardPersonnelComponent {}
