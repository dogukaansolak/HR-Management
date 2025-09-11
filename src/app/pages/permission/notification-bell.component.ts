import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
    imports: [NgIf],
  template: `
<div class="notification-bell" (click)="bellClick.emit()">
  <span class="bell-icon">
    <!-- Modern SVG Çan İkonu -->
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff6600" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  </span>
  <span class="notification-count" *ngIf="count > 0">{{ count }}</span>
</div>
  `,
  styles: [`
    .notification-bell {
      position: relative;
      cursor: pointer;
      margin-left: auto;
      margin-right: 20px;
      display: flex;
      align-items: center;
      transition: color 0.2s;
    }
    .bell-icon {
      font-size: 28px;
      color: #ff6600;
      transition: color 0.2s;
    }
    .notification-bell:hover .bell-icon {
      color: #ff3300;
    }
    .notification-count {
      position: absolute;
      top: 2px;
      right: -4px;
      background: #ff3300;
      color: #fff;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: bold;
      border: 2px solid #fff;
    }
  `]
})
export class NotificationBellComponent {
  @Input() count = 0;
  @Output() bellClick = new EventEmitter<void>();
}