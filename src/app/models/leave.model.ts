import { Person } from './personnel.model';

export interface Leave {
  id: number;
  employeeId: number;
  employee?: Person;

  leaveType: string; // "Yıllık", "Hastalık", "Mazeret"
  startDate: string; // string olarak değiştirildi
  endDate: string;   // string olarak değiştirildi

  reason: string; // Açıklama
  status: string; // "Pending", "Approved", "Rejected"

  createdAt?: string;
  updatedAt?: string;
}
