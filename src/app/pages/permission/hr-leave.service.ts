import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateLeaveDto, HRCreateLeaveDto, LeaveDto } from '../../models/leave.model';


@Injectable({ providedIn: 'root' })
export class HrLeaveService {
  private apiUrl = 'http://localhost:5179/api/hr/leave';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

   hrcreateLeave(leavePayload: HRCreateLeaveDto): Observable<LeaveDto> {
    return this.http.post<LeaveDto>(this.apiUrl, leavePayload, { headers: this.getAuthHeaders() });
  } 

getLeavesByPersonId(employeeId: number): Observable<LeaveDto[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<LeaveDto[]>(`${this.apiUrl}/person/${employeeId}`, { headers });
}

  getPendingLeaves(): Observable<LeaveDto[]> {
    return this.http.get<LeaveDto[]>(`${this.apiUrl}/all`, { headers: this.getAuthHeaders() });
  }
deleteLeave(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
}
  approveLeave(id: number) {
    return this.http.post(`${this.apiUrl}/${id}/approve`, {}, { headers: this.getAuthHeaders() });
  }
}