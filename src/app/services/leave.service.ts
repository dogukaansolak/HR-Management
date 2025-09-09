import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveDto, CreateLeaveDto, UpdateLeaveDto } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'https://localhost:7168/api/Leave'; // Backend API URL

  constructor(private http: HttpClient) {}

  getAllLeaves(): Observable<LeaveDto[]> {
    return this.http.get<LeaveDto[]>(this.apiUrl);
  }

  getLeaveById(id: number): Observable<LeaveDto> {
    return this.http.get<LeaveDto>(`${this.apiUrl}/${id}`);
  }

  createLeave(dto: CreateLeaveDto): Observable<LeaveDto> {
    return this.http.post<LeaveDto>(this.apiUrl, dto);
  }

  updateLeave(id: number, dto: UpdateLeaveDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  deleteLeave(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ✅ personId’ye göre izinleri getir
  getLeavesByPerson(personId: number): Observable<LeaveDto[]> {
    return this.http.get<LeaveDto[]>(`${this.apiUrl}/person/${personId}`);
  }
}
