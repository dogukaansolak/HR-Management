import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafePipe } from '../../pipes/safe.pipe';

interface Candidate {
  id: number;
  name: string;
  position: string;
  cvUrl: string;
  cvName?: string;
  status?: 'accepted' | 'declined' | null;
  note?: string;
  noteText?: string;
  showNoteInput?: boolean;
}

@Component({
  selector: 'app-candidate-management',
  standalone: true,
  imports: [CommonModule, FormsModule, SafePipe],
  templateUrl: './candidate.html',
  styleUrls: ['./candidate.css']
})
export class CandidateManagementComponent implements OnInit {
  candidates: Candidate[] = [
    { id: 1, name: 'Ahmet Yılmaz', position: 'Yazılım Geliştirici', cvUrl: '/assets/cvs/ahmet.pdf', cvName: 'ahmet.pdf' },
    { id: 2, name: 'Ayşe Demir', position: 'İK Uzmanı', cvUrl: '/assets/cvs/ayse.pdf', cvName: 'ayse.pdf' },
    { id: 3, name: 'Mehmet Kaya', position: 'Satış Temsilcisi', cvUrl: '/assets/cvs/mehmet.pdf', cvName: 'mehmet.pdf' },
    { id: 4, name: 'Elif Çelik', position: 'Pazarlama Uzmanı', cvUrl: '/assets/cvs/elif.pdf', cvName: 'elif.pdf' }
  ];

  filteredCandidates: Candidate[] = [];
  searchText: string = '';
  selectedPosition: string = '';
  selectedApproval: string = '';
  positions: string[] = [];

  // View modal
  showModal: boolean = false;
  selectedCandidate?: Candidate;

  // Add candidate modal
  showAddCandidateModal: boolean = false;
  newCandidate: Candidate = { id: 0, name: '', position: '', cvUrl: '', cvName: '', status: null, note: '' };

  // Delete confirm modal
  showDeleteConfirmModal: boolean = false;
  candidateToDelete?: Candidate;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 1;

  ngOnInit(): void {
    this.positions = Array.from(new Set(this.candidates.map(c => c.position)));
    this.filteredCandidates = [...this.candidates];
    this.updatePagination();
  }

  filterCandidates(resetPage: boolean = true): void {
    const q = this.searchText.trim().toLowerCase();
    this.filteredCandidates = this.candidates.filter(c => {
      const matchesName = c.name.toLowerCase().includes(q);
      const matchesPos = this.selectedPosition ? c.position === this.selectedPosition : true;
      const matchesApproval =
        this.selectedApproval === 'accepted' ? c.status === 'accepted' :
        this.selectedApproval === 'declined' ? c.status === 'declined' :
        true;
      return matchesName && matchesPos && matchesApproval;
    });

    if (resetPage) this.currentPage = 1;
    this.updatePagination();
  }

  // View modal
  openModal(candidate: Candidate): void {
    this.selectedCandidate = candidate;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCandidate = undefined;
  }

  get selectedCandidateUrl(): string {
    return this.selectedCandidate?.cvUrl ?? '';
  }

  // Pagination
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

  // Actions
  acceptCandidate(candidate?: Candidate): void {
    if (!candidate) return;
    candidate.status = 'accepted';
    this.filterCandidates(false);
  }

  declineCandidate(candidate?: Candidate): void {
    if (!candidate) return;
    candidate.status = 'declined';
    this.filterCandidates(false);
  }

  addNoteToCandidate(candidate?: Candidate, noteText?: string) {
    if (!candidate) return;
    candidate.note = noteText || '';
    candidate.showNoteInput = false;
    this.filterCandidates(false);
  }

  // --- Add candidate modal ---
  openAddCandidateModal(): void {
    this.showAddCandidateModal = true;
    this.newCandidate = { id: 0, name: '', position: '', cvUrl: '', cvName: '', status: null, note: '' };
  }

  closeAddCandidateModal(): void {
    this.showAddCandidateModal = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      alert('Lütfen sadece PDF dosyası yükleyin!');
      return;
    }

    this.newCandidate.cvUrl = URL.createObjectURL(file);
    this.newCandidate.cvName = file.name;
  }

  addCandidate(): void {
    if (!this.newCandidate.name || !this.newCandidate.position || !this.newCandidate.cvUrl) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    const newId = this.candidates.length ? Math.max(...this.candidates.map(c => c.id)) + 1 : 1;
    const candidate: Candidate = {
      id: newId,
      name: this.newCandidate.name,
      position: this.newCandidate.position,
      cvUrl: this.newCandidate.cvUrl,
      cvName: this.newCandidate.cvName,
      status: null,
      note: ''
    };

    this.candidates.push(candidate);
    this.positions = Array.from(new Set(this.candidates.map(c => c.position)));
    this.filterCandidates(false);
    this.closeAddCandidateModal();
  }

  // --- Delete confirm modal ---
  openDeleteConfirmModal(candidate: Candidate): void {
    this.candidateToDelete = candidate;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.candidateToDelete = undefined;
  }

  confirmDeleteCandidate(): void {
    if (!this.candidateToDelete) return;
    this.candidates = this.candidates.filter(c => c.id !== this.candidateToDelete!.id);
    this.filterCandidates(false);
    this.closeDeleteConfirmModal();
    this.closeModal();
  }
}
