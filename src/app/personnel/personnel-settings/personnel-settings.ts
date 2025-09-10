import { Component } from '@angular/core';

@Component({
  selector: 'app-personnel-settings',
  standalone: true,
  template: `
    <h2>Ayarlar</h2>
    <p>Burada personel kendi bilgilerini görebilir veya değiştirebilir.</p>
  `,
  styles: [`
    h2 { margin-bottom: 16px; }
    p { font-size: 14px; color: #555; }
  `]
})
export class PersonnelSettingsComponent {}
