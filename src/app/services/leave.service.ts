import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaveDto {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaveDto {
  employeeId: number;
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

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'https://localhost:5001/api/Leave'; // backend adresin

  constructor(private http: HttpClient) {}

  getAll(): Observable<LeaveDto[]> {
    return this.http.get<LeaveDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<LeaveDto> {
    return this.http.get<LeaveDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateLeaveDto): Observable<LeaveDto> {
    return this.http.post<LeaveDto>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateLeaveDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
