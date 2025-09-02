export interface CreateEmployeeDto {
  FirstName: string;
  LastName: string;
  TCKimlik: string;
  DogumTarihi: string; // ISO string!
  TelNo: string;
  Email: string;
  Position: string;
  WorkingStatus: string;
  PersonnelPhoto: string;
  StartDate: string; // ISO string!
  TotalLeave: number;
  UsedLeave: number;
  DepartmentId: number;
}