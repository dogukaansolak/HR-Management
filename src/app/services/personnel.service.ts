import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseHistoryWithId, Person } from '../models/personnel.model';
import { CreateEmployeeDto } from '../pages/personnel/createPersonnelDto';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private apiUrl = 'http://localhost:5179/api/Employee';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(isFormData = false): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    // Eğer FormData ise Content-Type ekleme!
    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }
fixNumber(val: string | number) {
  if (typeof val === 'string') {
    return parseFloat(val.replace(',', '.'));
  }
  return Number(val);
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
      departmentId: person.departmentId,
      // Eğer Person modelinde salary, mealCost, transportCost, otherCost varsa ekle:
      salary: this.fixNumber(person.salary),
      mealCost: this.fixNumber(person.mealCost),
      transportCost: this.fixNumber(person.transportCost),
    otherCost: this.fixNumber(person.otherCost),
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

  addExpense(personId: number, formData: FormData): Observable<any> {
    // Burada Content-Type eklenmiyor!
    return this.http.put<any>(`${this.apiUrl}/${personId}/cost`, formData, {
      headers: this.getAuthHeaders(true)
    });
  }

  updateExpense(expenseId: number, dto: { Amount: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/expenses/${expenseId}`, dto, { headers: this.getAuthHeaders() });
  }

  deleteExpense(expenseId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/expenses/${expenseId}`, { headers: this.getAuthHeaders() });
  }
  getExpenseHistory(personId: number): Observable<ExpenseHistoryWithId[]> {
    return this.http.get<ExpenseHistoryWithId[]>(`/api/employee/${personId}/expense-history`);
  }

}