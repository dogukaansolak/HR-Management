import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveDto, CreateLeaveDto, UpdateLeaveDto } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'https://localhost:7168/api/personnel/leave';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken'); // güncel token key
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Personelin kendi izinlerini getir
  getMyLeaves(): Observable<LeaveDto[]> {
    return this.http.get<LeaveDto[]>(`${this.apiUrl}/my-leaves`, { headers: this.getAuthHeaders() });
  }

  // Id'ye göre izin getir
  getLeaveById(id: number): Observable<LeaveDto> {
    return this.http.get<LeaveDto>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Yeni izin oluştur
  createLeave(leavePayload: CreateLeaveDto): Observable<LeaveDto> {
    return this.http.post<LeaveDto>(this.apiUrl, leavePayload, { headers: this.getAuthHeaders() });
  }

  // İzin güncelle
  updateLeave(id: number, leavePayload: UpdateLeaveDto): Observable<LeaveDto> {
    return this.http.put<LeaveDto>(`${this.apiUrl}/${id}`, leavePayload, { headers: this.getAuthHeaders() });
  }

  // İzin sil
  deleteLeave(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
