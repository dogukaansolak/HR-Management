export interface LeaveDto {
  Id: number;
  EmployeeId: number;
  EmployeeName: string;
  LeaveType: string;
  StartDate: Date;
  EndDate: Date;
  Reason: string;
  Status: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface CreateLeaveDto {
  EmployeeId: number;
  LeaveType: string;
  StartDate: Date;
  EndDate: Date;
  Reason: string;
  Status: string;
}

export interface UpdateLeaveDto {
  LeaveType: string;
  StartDate: Date;
  EndDate: Date;
  Reason: string;
  Status: string;
}
