import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/personnel.model';
import { CreateEmployeeDto } from '../pages/personnel/createPersonnelDto';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private apiUrl = 'https://localhost:7168/api/Employee'; // BACKEND API URL'ini buraya yaz

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }
  
  addPerson(person: any): Observable<any> {
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
      adres: person.adres,
      departmentId: person.departmentId
    };
    return this.http.post(this.apiUrl, body, { headers: this.getAuthHeaders() });
  }

  updatePerson(person: Person): Observable<Person> {
    const body = { ...person, departmentId: Number(person.departmentId) };
    return this.http.put<Person>(`${this.apiUrl}/${person.id}`, body, { headers: this.getAuthHeaders() });
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // ------------------- Expense Fonksiyonları -------------------
  addExpense(personId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${personId}/expenses`, formData, { headers: this.getAuthHeaders() });
  }

  updateExpense(expenseId: number, dto: { Amount: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/expenses/${expenseId}`, dto, { headers: this.getAuthHeaders() });
  }

  deleteExpense(expenseId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/expenses/${expenseId}`, { headers: this.getAuthHeaders() });
  }
}
