import { DatePipe } from "@angular/common";

// ExpenseHistory temel hali
export interface ExpenseHistory {
  amount: number;     // tutar
  date: Date;         // kaydedilen tarih
  fileUrl?: string;   // opsiyonel: fiş dosyası (resim/pdf)
  receiptUrls?: string[];  // Çoklu fiş URL'lerini tutmak için bu ideal.
  mealCost?: number;
  transportCost?: number;
  otherCost?: number;
}

// Backend’den dönen id’yi garanti etmek için ayrı interface
export interface ExpenseHistoryWithId {
  id: number;
  amount: number;
  date: Date | string;
  receiptUrls: string[];
  mealCost?: number;
  transportCost?: number;
  otherCost?: number;
}

// Person modeli
export interface Person {
  id?: number;
  firstName: string;
  lastName: string;
  tcKimlik?: string;
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
  hireDate?: string;   
  leaves?: { startDate: string, endDate: string }[];
  

  // Bu alanlar veritabanına eklenecek!
  adres?: string;

  salary?: number;
  mealCost?: number;
  transportCost?: number;
  otherCost?: number;

  // ExpenseHistory artık id zorunlu
  expenseHistory?: ExpenseHistoryWithId[]; 
}
