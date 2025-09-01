import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafePipe } from '../../pipes/safe.pipe';

interface Candidate {
  id: number;
  name: string;      // Ad Soyad
  position: string;  // Müracaat ettiği pozisyon
  cvUrl: string;     // PDF yolu
}

@Component({
  selector: 'app-candidate-management',
  templateUrl: './candidate.html',
  styleUrls: ['./candidate.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, SafePipe]
})
export class CandidateManagementComponent implements OnInit {

  candidates: Candidate[] = [
    { id: 1, name: 'Ahmet Yılmaz',  position: 'Yazılım Geliştirici', cvUrl: '/assets/cvs/ahmet.pdf' },
    { id: 2, name: 'Ayşe Demir',    position: 'İK Uzmanı',           cvUrl: '/assets/cvs/ayse.pdf' },
    { id: 3, name: 'Mehmet Kaya',   position: 'Satış Temsilcisi',    cvUrl: '/assets/cvs/mehmet.pdf' },
    { id: 4, name: 'Elif Çelik',    position: 'Pazarlama Uzmanı',    cvUrl: '/assets/cvs/elif.pdf' },
    { id: 5, name: 'Selin Acar',    position: 'Yazılım Geliştirici', cvUrl: '/assets/cvs/selin.pdf' },
    { id: 6, name: 'Mert Koç',      position: 'İK Uzmanı',           cvUrl: '/assets/cvs/mert.pdf' },   
    { id: 7, name: 'Ayşe Demir',    position: 'İK Uzmanı',           cvUrl: '/assets/cvs/ayse.pdf' },
    { id: 8, name: 'Mehmet Kaya',   position: 'Satış Temsilcisi',    cvUrl: '/assets/cvs/mehmet.pdf' },
    { id: 9, name: 'Elif Çelik',    position: 'Pazarlama Uzmanı',    cvUrl: '/assets/cvs/elif.pdf' },
    { id: 10, name: 'Selin Acar',    position: 'Yazılım Geliştirici', cvUrl: '/assets/cvs/selin.pdf' },
    { id: 11, name: 'Mert Koç',      position: 'İK Uzmanı',           cvUrl: '/assets/cvs/mert.pdf' },
    { id: 12, name: 'Ahmet Yılmaz',  position: 'Yazılım Geliştirici', cvUrl: '/assets/cvs/ahmet.pdf' },
    { id: 13, name: 'Ayşe Demir',    position: 'İK Uzmanı',           cvUrl: '/assets/cvs/ayse.pdf' },
    { id: 14, name: 'Mehmet Kaya',   position: 'Satış Temsilcisi',    cvUrl: '/assets/cvs/mehmet.pdf' },
    { id: 15, name: 'Elif Çelik',    position: 'Pazarlama Uzmanı',    cvUrl: '/assets/cvs/elif.pdf' },
    { id: 16, name: 'Selin Acar',    position: 'Yazılım Geliştirici', cvUrl: '/assets/cvs/selin.pdf' },
    { id: 17, name: 'Mert Koç',      position: 'İK Uzmanı',           cvUrl: '/assets/cvs/mert.pdf' },
    { id: 18, name: 'Ahmet Yılmaz',  position: 'Yazılım Geliştirici', cvUrl: '/assets/cvs/ahmet.pdf' },
    { id: 19, name: 'Ahmet Yılmaz',  position: 'Yazılım Geliştirici', cvUrl: '/assets/cvs/ahmet.pdf' },
    { id: 20, name: 'Ayşe Demir',    position: 'İK Uzmanı',           cvUrl: '/assets/cvs/ayse.pdf' },

  ];

  filteredCandidates: Candidate[] = [];
  searchText: string = '';
  selectedPosition: string = '';
  positions: string[] = [];

  showModal: boolean = false;
  selectedCandidate?: Candidate;

  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 1;

  ngOnInit(): void {
    this.positions = Array.from(new Set(this.candidates.map(c => c.position)));
    this.filteredCandidates = [...this.candidates];
    this.updatePagination();
  }

  filterCandidates(): void {
    const q = this.searchText.trim().toLowerCase();
    this.filteredCandidates = this.candidates.filter(c => {
      const matchesName = c.name.toLowerCase().includes(q);
      const matchesPos  = this.selectedPosition ? c.position === this.selectedPosition : true;
      return matchesName && matchesPos;
    });
    this.currentPage = 1;
    this.updatePagination();
  }

  openModal(candidate: Candidate): void {
    this.selectedCandidate = candidate;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCandidate = undefined;
  }

  get selectedCandidateUrl(): string {
    return this.selectedCandidate ? this.selectedCandidate.cvUrl : '';
  }

  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredCandidates.length / this.pageSize));
  }

  get pagedCandidates(): Candidate[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCandidates.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }
}
