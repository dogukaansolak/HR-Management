import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Permission, IzinTuru, Durum } from '../../models/permission.model';
import { Personnel } from '../../models/personnel.model';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.html',
  styleUrls: ['./permission.css'],
  imports: [CommonModule],
  providers: [DatePipe]
})
export class PermissionComponent {
  izinler: Permission[] = [];
  isLoading: boolean = true;
  hataMesaji: string = '';

  constructor(private datePipe: DatePipe) {
    this.loadIzinler();
  }

  loadIzinler() {
    // // Örnek veri
    // const calisan: Personnel = {
    //   id: 1,
    //   firstName: 'Ahmet',
    //   lastName: 'Yılmaz',
    //   tckimlik: '12345678901',
    //   dogumtarihi: '1990-01-01',
    //   totalLeave: 20,
    //   usedLeave: 5,
    //   workingStatus: 'Çalışıyor',
    //   personnelphoto: '',
    // };

    // this.izinler = [
    //   new Permission(
    //     1,
    //     calisan,
    //     IzinTuru.YILLIK_IZIN,
    //     new Date('2025-09-01'),
    //     new Date('2025-09-05'),
    //     'Yıllık izin',
    //     Durum.ONAY_BEKLIYOR,
    //     new Date()
    //   )
    // ];

    this.isLoading = false;
  }

  onOnayla(id: number) {
    const izin = this.izinler.find(i => i.id === id);
    if (izin) izin.durum = Durum.ONAYLANDI;
  }

  onReddet(id: number) {
    const izin = this.izinler.find(i => i.id === id);
    if (izin) izin.durum = Durum.REDDEDILDI;
  }
}
