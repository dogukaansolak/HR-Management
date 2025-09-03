import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Leave } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:5000/api/leaves'; // Backend endpoint

  constructor(private http: HttpClient) {}

  getLeavesByEmployee(employeeId: number): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  createLeave(leave: Leave): Observable<Leave> {
    return this.http.post<Leave>(this.apiUrl, leave);
  }

  updateLeave(id: number, leave: Leave): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/${id}`, leave);
  }

  deleteLeave(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
