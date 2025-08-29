import { Personnel } from './personnel.model';

// İzin türleri enum
export enum IzinTuru {
  YILLIK_IZIN = 'Yıllık İzin',
  MAZERET_IZNI = 'Mazeret İzni',
  RAPORLU = 'Raporlu',
  UCRETSIZ_IZIN = 'Ücretsiz İzin'
}

// Talep durumları enum
export enum Durum {
  ONAY_BEKLIYOR = 'Onay Bekliyor',
  ONAYLANDI = 'Onaylandı',
  REDDEDILDI = 'Reddedildi'
}

// İzin kaydı sınıfı
export class Permission {
  id: number;
  calisan: Personnel;  // Burada Calisan yerine Personnel kullanıyoruz
  izinTuru: IzinTuru;
  baslangicTarihi: Date;
  bitisTarihi: Date;
  aciklama: string;
  durum: Durum;
  talepTarihi: Date;

  constructor(
    id: number,
    calisan: Personnel,
    izinTuru: IzinTuru,
    baslangicTarihi: Date,
    bitisTarihi: Date,
    aciklama: string,
    durum: Durum,
    talepTarihi: Date
  ) {
    this.id = id;
    this.calisan = calisan;
    this.izinTuru = izinTuru;
    this.baslangicTarihi = baslangicTarihi;
    this.bitisTarihi = bitisTarihi;
    this.aciklama = aciklama;
    this.durum = durum;
    this.talepTarihi = talepTarihi;
  }

  // İznin kaç gün sürdüğünü hesaplar
  get sureGun(): number {
    const farkZaman = this.bitisTarihi.getTime() - this.baslangicTarihi.getTime();
    return Math.ceil(farkZaman / (1000 * 3600 * 24)) + 1;
  }
}
