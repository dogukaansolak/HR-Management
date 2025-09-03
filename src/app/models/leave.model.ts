// src/app/models/leave.model.ts

import { Person } from './personnel.model';

export interface Leave {
  id: number;
  employeeId: number;
  employee?: Person; // Opsiyonel çünkü backend her zaman dönmeyebilir

  leaveType: string; // "Yıllık", "Hastalık", "Mazeret"
  startDate: Date;
  endDate: Date;

  reason: string; // Açıklama
  status: string; // "Pending", "Approved", "Rejected"

  createdAt: Date;
  updatedAt: Date;
}