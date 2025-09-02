
// export interface Personnel {
//     id: number;
//     firstName: string;
//     lastName?: string;
//     tckimlik: string;
//     dogumtarihi: string;
//     telno?: string;
//     adres?: string;
//     email?: string;
//     position?: string;
//     department?: string;
//     startDate?: string; 
//     totalLeave: number;
//     usedLeave: number;
//     workingStatus: 'Çalışıyor' | 'İzinli' | 'Uzaktan';  //bu satırı üst satıra alınablir
//     personnelphoto: string;
//     kullanilanIzin: number;
//     yillikIzinHakki: number | null;
// }


export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  tckimlik: string;
  dogumtarihi: string;
  telno?: string;
  adres?: string;
  email?: string;
  position?: string;
  department?: string;
  startDate?: string;
  totalLeave?: number;      // yıllık izin hakkı
  usedLeave?: number;       // kullanılan izin
  workingStatus: "Çalışıyor" | "İzinli";
  personnelphoto: string;
}
