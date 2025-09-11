// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export interface Department {
//   id: number;
//   name: string;
// }

// @Injectable({ providedIn: 'root' })
// export class DepartmentService {
//   private apiUrl = 'https://localhost:7168/api/Department';

//   constructor(private http: HttpClient) {}

//   getDepartments(): Observable<Department[]> {
//     const token = localStorage.getItem('accessToken');
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.get<Department[]>(this.apiUrl, { headers });
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Bu interface tanımı harika, olduğu gibi kalabilir.
export interface Department {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'https://localhost:7168/api/Department';

  constructor(private http: HttpClient) {}

  /**
   * Yetkilendirme (Authorization) başlığını oluşturan özel bir metot.
   * Bu sayede kodu tekrar yazmaktan kaçınırız.
   * @returns HttpHeaders objesi
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken'); // Token'ı al
    // Eğer token yoksa boş bir header dönebilir veya hata yönetimi yapabiliriz.
    // Şimdilik token'ın var olduğunu varsayıyoruz.
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * API'den tüm departmanların listesini getirir. (Senin yazdığın kod)
   * @returns Departman dizisi içeren bir Observable
   */
  getDepartments(): Observable<Department[]> {
    const headers = this.getAuthHeaders(); // Başlıkları oluştur
    return this.http.get<Department[]>(this.apiUrl, { headers });
  }

  /**
   * YENİ METOT: API'ye yeni bir departman eklemek için POST isteği gönderir.
   * @param departmentName Eklenmek istenen departmanın adı
   * @returns Sunucudan dönen yeni departman objesini içeren bir Observable
   */
  addDepartment(departmentName: string): Observable<number> { // <--- DEĞİŞİKLİK 1
  const headers = this.getAuthHeaders();
  
  // DEĞİŞİKLİK 2: .NET API'leri genellikle PascalCase (büyük harfle başlayan)
  // özellikler beklediği için 'name' yerine 'Name' kullanıyoruz.
  // Bu, backend'de modelin doğru şekilde bağlanmasını garantiler.
  const newDepartment = { Name: departmentName };
  
  // API'den dönecek cevabın 'number' tipinde olacağını belirtiyoruz.
  return this.http.post<number>(this.apiUrl, newDepartment, { headers }); // <--- DEĞİŞİKLİK 1
}
}