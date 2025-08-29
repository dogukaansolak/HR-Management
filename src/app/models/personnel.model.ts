
export interface Personnel {
    id: number;
    firstName: string;
    lastName?: string;
    tckimlik: string;
    dogumtarihi: string;
    telno?: string;
    adres?: string;
    email?: string;
    position?: string;
    department?: string;
    startDate?: string; 
    totalLeave: number;
    usedLeave: number;
    workingStatus: string;
    //'Çalışıyor' | 'İzinli' | 'Uzaktan';  bu satırı üst satıra alınablir
    personnelphoto: string;
}
