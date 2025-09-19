import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface tanımı
export interface Department {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:5179/api/Department';

  constructor(private http: HttpClient) {}

  /**
   * Yetkilendirme (Authorization) başlığını oluşturan özel bir metot.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * API'den tüm departmanların listesini getirir.
   */
  getDepartments(): Observable<Department[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Department[]>(this.apiUrl, { headers });
  }

  /**
   * API'ye yeni bir departman eklemek için POST isteği gönderir.
   */
  addDepartment(departmentName: string): Observable<number> {
    const headers = this.getAuthHeaders();
    const newDepartment = { Name: departmentName };
    return this.http.post<number>(this.apiUrl, newDepartment, { headers });
  }

  /**
   * YENİ EKLENEN METOT: Belirtilen ID'ye sahip departmanı siler.
   * @param id Silinmek istenen departmanın kimlik (ID) numarası
   * @returns Genellikle boş bir cevap döner, bu yüzden 'any' tipi kullanmak güvenlidir.
   */
  deleteDepartment(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    
    // API'ye hangi departmanın silineceğini belirtmek için URL'ye ID'yi ekliyoruz.
    // Örn: https://localhost:7168/api/Department/15
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}