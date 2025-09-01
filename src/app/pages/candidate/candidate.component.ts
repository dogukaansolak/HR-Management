import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../models/candidate.model';
import { SafePipe } from '../../pipes/safe.pipe';

@Component({
  selector: 'app-candidate-management',
  templateUrl: './candidate.html',
  styleUrls: ['./candidate.css'],
  standalone: true,
  imports: [FormsModule, SafePipe] // ngModel ve pipe kullanımı için
})
export class CandidateManagementComponent {
  candidates: Candidate[] = [
    { id: 1, name: 'Ahmet Yılmaz', department: 'IT', cvUrl: '/assets/cvs/ahmet.pdf' },
    { id: 2, name: 'Ayşe Demir', department: 'HR', cvUrl: '/assets/cvs/ayse.pdf' },
    { id: 3, name: 'Mehmet Kaya', department: 'Sales', cvUrl: '/assets/cvs/mehmet.pdf' },
    { id: 4, name: 'Elif Çelik', department: 'Marketing', cvUrl: '/assets/cvs/elif.pdf' }
  ];

  filteredCandidates: Candidate[] = [...this.candidates];
  searchText: string = '';
  selectedDepartment: string = '';
  departments: string[] = ['IT', 'HR', 'Sales', 'Marketing'];

  showModal: boolean = false;
  selectedCandidate?: Candidate;

  filterCandidates() {
    this.filteredCandidates = this.candidates.filter(c => {
      const matchesName = c.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDept = this.selectedDepartment ? c.department === this.selectedDepartment : true;
      return matchesName && matchesDept;
    });
    this.currentPage = 1;
    this.updatePagination();
  }


  openModal(candidate: Candidate) {
    this.selectedCandidate = candidate;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedCandidate = undefined;
  }

  deleteCandidate(candidate: Candidate) {
    this.candidates = this.candidates.filter(c => c.id !== candidate.id);
    this.filterCandidates();
  }

  // TS2532 hatasını önlemek için getter kullanabiliriz
  get selectedCandidateUrl(): string {
    return this.selectedCandidate ? this.selectedCandidate.cvUrl : '';
  }

  exportToCSV() {
    const headers = ['ID', 'İsim', 'Departman', 'CV URL'];
    const rows = this.filteredCandidates.map(c => [c.id, c.name, c.department, c.cvUrl]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\r\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'candidates.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  currentPage: number = 1;
  pageSize: number = 2; // Sayfa başına kaç aday gösterilecek
  totalPages: number = 1;

  ngOnInit() {
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredCandidates.length / this.pageSize);
  }

  get pagedCandidates() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCandidates.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

}
