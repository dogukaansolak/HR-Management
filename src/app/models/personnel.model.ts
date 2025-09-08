import { DatePipe } from "@angular/common";

// Tek bir gider hareketi (ör: maaş, yemek vs.)
export interface ExpenseHistory {
  amount: number;     // tutar
  date: Date;         // kaydedilen tarih
  //fileUrl?: string;   // opsiyonel: fiş dosyası (resim/pdf)
  receiptUrls?: string[];  // Çoklu fiş URL'lerini tutmak için bu ideal.
}

export interface Person {
  id?: number;
  firstName: string;
  lastName: string;
  tckimlik?: string;
  dogumTarihi?: Date | null;
  telNo?: string;
  email?: string;
  position?: string;
  workingStatus?: string;
  personnelPhoto?: string;
  startDate?: Date | null;
  totalLeave?: number;
  usedLeave?: number;
  departmentId?: number;
  departmentName?: string;

  // Bu alanlar veritabanına eklenecek!
  adres?: string; // şu an DB’de yok ama modelde tutuluyor

  // Masraf alanları
  salary?: number;
  mealCost?: number;
  transportCost?: number;
  otherCost?: number;

  expenseHistory?: ExpenseHistory[];
}
