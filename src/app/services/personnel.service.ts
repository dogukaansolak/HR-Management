import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Personnel } from '../models/personnel.model';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private mockPersonnelData: Personnel[] = [
    { 
      id: 101, 
      firstName: 'Ahmet', 
      lastName: 'Yılmaz', 
      tckimlik: '12345678901',   // ekledik
      dogumtarihi: '1990-03-15', // ekledik
      telno: '05551234567',       // ekledik
      email: 'ahmet.yilmaz@example.com', 
      position: 'Yazılım Geliştirici', 
      department: 'IT', 
      startDate: '2023-05-15', 
      totalLeave: 20, 
      usedLeave: 5, 
      workingStatus: 'Çalışıyor', 
      personnelphoto: '../images/b5707ec1-332d-4e29-8ac0-eca895bfb3d0.jpg',

    },
    { 
      id: 102, 
      firstName: 'Ayşe', 
      lastName: 'Kaya', 
      tckimlik: '10987654321', 
      dogumtarihi: '1988-07-20', 
      telno: '05559876543',
      email: 'ayse.kaya@example.com', 
      position: 'Proje Yöneticisi', 
      department: 'Yönetim', 
      startDate: '2022-01-20', 
      totalLeave: 25, 
      usedLeave: 10, 
      workingStatus: 'İzinli', 
      personnelphoto: '../images/1f93e380-509a-477b-a3d1-f36894aa28a5.jpg',

    }
  ];

  getPersonnelList(): Observable<Personnel[]> {
    return of(this.mockPersonnelData).pipe(delay(500));
  }

  addPersonnel(person: Personnel) {
    person.id = this.mockPersonnelData.length ? Math.max(...this.mockPersonnelData.map(p => p.id)) + 1 : 101;
    this.mockPersonnelData.push(person);
  }

  deletePersonnel(id: number) {
    this.mockPersonnelData = this.mockPersonnelData.filter(p => p.id !== id);
  }
}
