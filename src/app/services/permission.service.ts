// izin.service.ts
// İzin kayıtları ile ilgili tüm API operasyonlarını yöneten servis.
// Component'ler doğrudan API'yi çağırmaz, bu servisi kullanır.
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Personnel } from '../models/personnel.model';
import { Permission, IzinTuru, Durum } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private _mockIzinler: Permission[] = [];
  private nextId: number = 1;

  constructor() {
    // Başlangıç için bazı örnek veriler ekleyelim
    const calisan1: Personnel = {
      id: 1,
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      tckimlik: '12345678901',
      dogumtarihi: '1990-01-01',
      telno: '5551112233',
      adres: 'Örnek Mah. No:1, İstanbul',
      email: 'ahmet.yilmaz@example.com',
      position: 'Yazılım Mühendisi',
      department: 'AR-GE',
      startDate: '2020-01-15',
      totalLeave: 20,
      usedLeave: 5,
      workingStatus: 'Çalışıyor',
      personnelphoto: 'assets/images/1f93e380-509a-477b-a3d1-f36894aa28a5.jpg',
    };

    const calisan2: Personnel = {
      id: 2,
      firstName: 'Ayşe',
      lastName: 'Demir',
      tckimlik: '10987654321',
      dogumtarihi: '1985-05-20',
      telno: '5554445566',
      adres: 'Deneme Cad. No:10, Ankara',
      email: 'ayse.demir@example.com',
      position: 'Proje Yöneticisi',
      department: 'Yönetim',
      startDate: '2018-03-10',
      totalLeave: 25,
      usedLeave: 10,
      workingStatus: 'Çalışıyor',
      personnelphoto: 'assets/images/b5707ec1-332d-4e29-8ac0-eca895bfb3d0.jpg',
    };

    this._mockIzinler.push(
      new Permission(
        this.nextId++,
        calisan1,
        IzinTuru.YILLIK_IZIN,
        new Date('2025-09-01'),
        new Date('2025-09-05'),
        'Yıllık izin talebi',
        Durum.ONAY_BEKLIYOR,
        new Date()
      )
    );
    this._mockIzinler.push(
      new Permission(
        this.nextId++,
        calisan2,
        IzinTuru.MAZERET_IZNI,
        new Date('2025-08-10'),
        new Date('2025-08-12'),
        'Mazeret izni talebi',
        Durum.ONAYLANDI,
        new Date()
      )
    );
  }

  // Tüm izin kayıtlarını getiren metot.
  getPermissions(): Observable<Permission[]> {
    console.log('İzin kayıtları servisten çekiliyor...');
    return of(this._mockIzinler).pipe(delay(1000));
  }

  // Yeni bir izin kaydı ekleyen metot.
  addPermission(permission: Permission): Observable<Permission> {
    permission.id = this.nextId++;
    this._mockIzinler.push(permission);
    console.log('Yeni izin eklendi:', permission);
    return of(permission).pipe(delay(500));
  }

  // Bir izin kaydını güncelleyen metot.
  updatePermission(updatedPermission: Permission): Observable<Permission> {
    const index = this._mockIzinler.findIndex(p => p.id === updatedPermission.id);
    if (index > -1) {
      this._mockIzinler[index] = updatedPermission;
      console.log('İzin güncellendi:', updatedPermission);
      return of(updatedPermission).pipe(delay(500));
    }
    return throwError(() => new Error('İzin kaydı bulunamadı.'));
  }

  // Bir izin kaydını silen metot.
  deletePermission(id: number): Observable<boolean> {
    const initialLength = this._mockIzinler.length;
    this._mockIzinler = this._mockIzinler.filter(p => p.id !== id);
    if (this._mockIzinler.length < initialLength) {
      console.log(`ID ${id} olan izin silindi.`);
      return of(true).pipe(delay(500));
    }
    return throwError(() => new Error('İzin kaydı bulunamadı.'));
  }

  // Bir iznin durumunu güncelleyen metot (Onay/Ret).
  updatePermissionStatus(id: number, yeniDurum: Durum): Observable<Permission | undefined> {
    const izin = this._mockIzinler.find(i => i.id === id);
    if (izin) {
      izin.durum = yeniDurum;
      console.log(`ID ${id} olan iznin durumu ${yeniDurum} olarak güncellendi.`);
      return of(izin).pipe(delay(500)); // Başarılı güncelleme simülasyonu
    }
    return throwError(() => new Error('İzin kaydı bulunamadı.'));
  }
}