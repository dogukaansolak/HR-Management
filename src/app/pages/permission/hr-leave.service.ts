import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveDto } from '../../models/leave.model';


@Injectable({ providedIn: 'root' })
export class HrLeaveService {
  private apiUrl = 'https://localhost:7168/api/hr/leave';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getPendingLeaves(): Observable<LeaveDto[]> {
    return this.http.get<LeaveDto[]>(`${this.apiUrl}/all`, { headers: this.getAuthHeaders() });
  }

  approveLeave(id: number) {
    return this.http.post(`${this.apiUrl}/${id}/approve`, {}, { headers: this.getAuthHeaders() });
  }
}