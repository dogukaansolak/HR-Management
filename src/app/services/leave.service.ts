import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Leave } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'https://localhost:7168/api/Leave';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers.set('Content-Type', 'application/json');
  }

  // Tüm izinleri getir
  getLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Id'ye göre izin getir
  getLeaveById(id: number): Observable<Leave> {
    return this.http.get<Leave>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Yeni izin oluştur
  createLeave(leavePayload: unknown): Observable<Leave> {
    return this.http.post<Leave>(this.apiUrl, leavePayload, { headers: this.getAuthHeaders() });
  }

  // İzin güncelle
  updateLeave(id: number, leave: Partial<Leave>): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/${id}`, leave, { headers: this.getAuthHeaders() });
  }

  // İzin sil
  deleteLeave(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
