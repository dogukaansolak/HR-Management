export interface Permission {
  id: number;
  adSoyad: string;
  departman: string;
  yillikIzinHakki: number | null; // null => yok
  kullanilanIzin: number;
  durum: "Çalışıyor" | "İzinli";
}
