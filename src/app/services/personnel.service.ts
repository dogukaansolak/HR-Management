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
      FirstName: person.firstName,
      LastName: person.lastName,
      TCKimlik: person.tckimlik,
      DogumTarihi: person.dogumTarihi ? new Date(person.dogumTarihi).toISOString() : '',
      TelNo: person.telNo,
      Email: person.email,
      Position: person.position,
      WorkingStatus: person.workingStatus,
      PersonnelPhoto: person.personnelPhoto,
      StartDate: person.startDate ? new Date(person.startDate).toISOString() : '',
      TotalLeave: person.totalLeave,
      UsedLeave: person.usedLeave,
      DepartmentId: person.departmentId
    };

    return this.http.post(this.apiUrl, body, { headers });
  }

  updatePerson(person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${person.id}`, person);
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}