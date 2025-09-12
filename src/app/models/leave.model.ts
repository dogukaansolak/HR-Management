export interface LeaveDto {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  reason: string;
  status: string;    // "Beklemede", "Izinli", "Reddedildi"
  createdAt: string;
  updatedAt: string;
}

export interface HRCreateLeaveDto {
   employeeId: number; 
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface CreateLeaveDto {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface UpdateLeaveDto {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}
