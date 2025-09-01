import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permission } from './../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl = 'https://localhost:5001/api/permissions'; // .NET backend URL

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.apiUrl);
  }
}
