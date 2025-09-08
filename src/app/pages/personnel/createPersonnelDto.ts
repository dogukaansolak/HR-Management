export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  tcKimlik: string;
  dogumTarihi: string; // ISO string!
  telNo: string;
  email: string;
  position: string;
  workingStatus: string;
  personnelPhoto: string;
  startDate: string; // ISO string!
  totalLeave: number;
  usedLeave: number;
  departmentId: number;
  adres: string;
}