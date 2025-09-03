import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/personnel.model';
import { CreateEmployeeDto } from '../pages/personnel/createPersonnelDto';


@Injectable({ providedIn: 'root' })
export class PersonService {
  private apiUrl = 'https://localhost:7168/api/Employee'; // BACKEND API URL'ini buraya yaz

  constructor(private http: HttpClient) {}

  getPersons(): Observable<Person[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Person[]>(this.apiUrl, { headers });
  }

  addPerson(person: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // DİKKAT: Alan adları büyük harfle! Tarihler ISO string!
    const body: CreateEmployeeDto = {
      firstName: person.firstName,
      lastName: person.lastName,
      tcKimlik: person.tcKimlik,
      dogumTarihi: person.dogumTarihi ? new Date(person.dogumTarihi).toISOString() : '',
      telNo: person.telNo,
      email: person.email,
      position: person.position,
      workingStatus: person.workingStatus,
      personnelPhoto: person.personnelPhoto,
      startDate: person.startDate ? new Date(person.startDate).toISOString() : '',
      totalLeave: person.totalLeave,
      usedLeave: person.usedLeave,
      departmentId: person.departmentId
    };

    return this.http.post(this.apiUrl, body, { headers });
  }

  updatePerson(person: Person): Observable<Person> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // departmentId kesinlikle sayı olmalı!
    const body = {
      ...person,
      departmentId: Number(person.departmentId)
    };
    return this.http.put<Person>(`${this.apiUrl}/${person.id}`, body, { headers });
  }

  deletePerson(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

}