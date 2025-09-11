import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
    imports: [NgIf],
  template: `
    <div class="notification-bell" (click)="bellClick.emit()">
      <span class="bell-icon">&#128276;</span>
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