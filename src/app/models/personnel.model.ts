
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
  id?: number;
  firstName?: string;
  lastName?: string;
  tckimlik?: string;
  dogumTarihi?: string;
  telNo?: string;
  email?: string;
  position?: string;
  workingStatus?: string;
  personnelPhoto?: string;
  startDate?: string;
  totalLeave?: number;
  usedLeave?: number;
  departmentId?: number;
  departmentName?: string;
  adres?: string;
}