import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LeaveDto } from '../../models/leave.model';
import { DatePipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [DatePipe, NgIf, NgForOf], // DatePipe'u ekledik!
  template: `
    <div class="notification-panel" [class.open]="open">
      <div class="panel-header">
        <span>Bekleyen İzin Talepleri</span>
        <span class="close-btn" (click)="close.emit()">&times;</span>
      </div>
      <div class="panel-body" *ngIf="leaves.length > 0">
        <div class="leave-item" *ngFor="let leave of leaves">
          <div>
            <b>{{ leave.employeeName }}</b>
            <span style="font-size:12px;color:#888;margin-left:6px">{{ leave.leaveType }}</span>
            <br>
            <span>{{ leave.startDate | date:'dd.MM.yyyy' }} - {{ leave.endDate | date:'dd.MM.yyyy' }}</span>
            <div style="font-size:12px;color:#666;">{{ leave.reason }}</div>
          </div>
          <button (click)="onApprove(leave.id)">Onayla</button>
        </div>
      </div>
      <div class="panel-body" *ngIf="leaves.length === 0">
        <span>Bekleyen izin talebi yok.</span>
      </div>
    </div>
  `,
  styles: [`
    .notification-panel {
      position: fixed;
      top: 40px;
      right: -360px;
      width: 340px;
      height: 100%;
      background: #fff;
      box-shadow: -3px 0 12px rgba(0,0,0,0.13);
       z-index: 3000;
      transition: right 0.3s;
      display: flex;
      flex-direction: column;
      border-left: 1px solid #eee;
    }
    .notification-panel.open {
      right: 0;
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 20px;
      background: #ff6600;
      color: #fff;
      font-weight: 600;
      font-size: 18px;
      border-bottom: 1px solid #ffd2b3;
    }
    .close-btn {
      font-size: 24px;
      cursor: pointer;
      font-weight: bold;
      color: #fff;
      margin-left: 10px;
    }
    .close-btn:hover {
      color: #222;
    }
    .panel-body {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
    .leave-item {
      background: #f9fafb;
      border-radius: 8px;
      padding: 13px 10px 13px 16px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #f1f1f1;
      box-shadow: 0 1px 2px rgba(255,102,0,0.03);
      animation: fadeIn 0.4s;
    }
    .leave-item button {
      background: #3498db;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 6px 14px;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .leave-item button:hover {
      background: #217dbb;
    }
  `]
})
export class NotificationPanelComponent {
  @Input() open = false;
  @Input() leaves: LeaveDto[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() approve = new EventEmitter<number>();

  onApprove(id: number) {
    this.approve.emit(id);
  }
}