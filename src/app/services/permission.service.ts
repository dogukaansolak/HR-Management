// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { Permission } from './../models/permission.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class PermissionService {
//   // private apiUrl = 'https://localhost:5001/api/permissions'; // .NET backend URL

//   constructor(private http: HttpClient) {}

//   // Örnek veri
//   private permissions: Permission[] = [
//     {
//       id: 102,
//       adSoyad: 'Kenan Komutan',
//       departman: 'Hademe',
//       yillikIzinHakki: 25,
//       kullanilanIzin: 10,
//       durum: 'İzinli'
//     },
//     {
//       id: 103,
//       adSoyad: 'Ayşe Kaya',
//       departman: 'Muhasebe',
//       yillikIzinHakki: 20,
//       kullanilanIzin: 5,
//       durum: 'Çalışıyor'
//     }
//   ];

//   // Backend yoksa mock olarak Observable döndürebiliriz
//   getPermissions(): Observable<Permission[]> {
//     return of(this.permissions);
//     // Gerçek backend için:
//     // return this.http.get<Permission[]>(this.apiUrl);
//   }
// }
