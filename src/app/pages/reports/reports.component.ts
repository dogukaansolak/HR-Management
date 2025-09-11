import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { saveAs } from 'file-saver';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    BaseChartDirective
  ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
  animations: [
    trigger('slideToggle', [
      state('open', style({ height: '*', opacity: 1, padding: '*' })),
      state('closed', style({ height: '0px', opacity: 0, padding: '0px 0px' })),
      transition('open <=> closed', animate('300ms ease-in-out')),
    ])
  ]
})
export class ReportsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  filterForm!: FormGroup;
  filterVisible: boolean = true;

  performanceData!: ChartConfiguration<'pie'>['data'];
  leaveData!: ChartConfiguration<'bar'>['data'];
  costData!: ChartConfiguration<'line'>['data'];

  performanceOptions: ChartOptions<'pie'> = { responsive: true, animation: { duration: 800 } };
  leaveOptions: ChartOptions<'bar'> = { responsive: true, animation: { duration: 800 } };
  costOptions: ChartOptions<'line'> = { responsive: true, animation: { duration: 800 } };

  departments: string[] = [];

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      department: [''],
      personId: ['']
    });

    // filtre değişikliklerini dinle
    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe(() => this.loadReports());

    // departmanları al
    this.loadDepartments();

    // ilk raporları yükle
    this.loadReports();
  }

  loadDepartments() {
    this.http.get<any>('http://localhost:8000/api/departments').subscribe(res => {
      this.departments = res.departments;
    });
  }

  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }

  loadReports() {
    const filters = this.filterForm.value;
    let params = new HttpParams();
    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);
    if (filters.department) params = params.set('department', filters.department);
    if (filters.personId) params = params.set('personId', filters.personId);

    this.http.get<any>('http://localhost:8000/api/reports', { params }).subscribe(res => {
      // Performans grafiği (pie)
      this.performanceData = {
        labels: res.performance.labels,
        datasets: [{
          label: 'Performans',
          data: res.performance.data,
          backgroundColor: ['#42A5F5','#66BB6A','#FFA726','#AB47BC','#EF5350']
        }]
      };

      // İzin dağılımı (departman seçimine göre)
      this.leaveData = {
        labels: res.leave.labels,
        datasets: [{
          data: res.leave.data,
          backgroundColor: ['#66BB6A', '#FFA726', '#EF5350', '#42A5F5', '#AB47BC']
        }]
      };

      // Masraf grafiği (masraflar vs bütçe)
      this.costData = {
        labels: res.cost.labels,
        datasets: [
          {
            label: 'Masraflar',
            data: res.cost.data,
            borderColor: '#AB47BC',
            backgroundColor: 'rgba(171,71,188,0.3)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Bütçe',
            data: res.cost.budget,
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66,165,245,0.3)',
            fill: false,
            borderDash: [5,5],
            tension: 0.4
          }
        ]
      };

      setTimeout(() => this.chart?.update(), 0);
    });
  }

  exportExcel() {
    const filters = this.filterForm.value;
    let params = new HttpParams();
    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);
    if (filters.department) params = params.set('department', filters.department);
    if (filters.personId) params = params.set('personId', filters.personId);

    this.http.get('http://localhost:8000/api/reports/excel', { params, responseType: 'blob' })
      .subscribe(blob => saveAs(blob, `Rapor_${new Date().toISOString().slice(0, 10)}.xlsx`));
  }

  exportPdf() {
    const filters = this.filterForm.value;
    let params = new HttpParams();
    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);
    if (filters.department) params = params.set('department', filters.department);
    if (filters.personId) params = params.set('personId', filters.personId);

    this.http.get('http://localhost:8000/api/reports/pdf', { params, responseType: 'blob' })
      .subscribe(blob => saveAs(blob, `Rapor_${new Date().toISOString().slice(0, 10)}.pdf`));
  }
}
