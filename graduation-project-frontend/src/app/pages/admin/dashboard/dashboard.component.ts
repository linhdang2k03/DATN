import { SearchService } from './../../../services/search.service';
import { Search } from './../../../models/search';
import { Component, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { ItemSlotComponent } from '../../../components/item-slot/item-slot.component';
import { Chart, registerables } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private searchService: SearchService
  ) {}

  //Thống kê lịch sử tìm kiếm
  searchStats: Search[] = [];

  current = {
    day: new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate(),
    month: new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1,
    year: new Date().getFullYear()
  };

  filter1 = {
    year: 2024
  };

  filter2 = {
    order: 'descending',
    from: `${this.current.year}-${this.current.month}-01`,
    to: `${this.current.year}-${this.current.month}-${this.current.day}`,
    quantity: 10
  };

  filter3 = {
    order: 'ascending',
    from: `${this.current.year}-${this.current.month}-01`,
    to: `${this.current.year}-${this.current.month}-${this.current.day}`,
    quantity: 10
  };

  chart: any;
  config: any = {
    type: 'bar',
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      datasets: [
        {
          label: 'New Account',
          data: [65, 59, 80, 81, 56, 55, 40, 12, 32, 34, 64, 65],
          backgroundColor: '#4CC297'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            align: 'end',
            text: 'Account',
            color: '#424242',
            font: {
              size: 12,
              weight: 'bold'
            }
          }
        },
        y: {
          title: {
            display: true,
            align: 'end',
            text: 'Month',
            color: '#424242',
            font: {
              size: 12,
              weight: 'bold'
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          align: 'start'
        }
      }
    }
  };

  ngOnInit(): void {
    this.loadSearchStats();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const canvas = this.chartCanvas.nativeElement;
      this.chart = new Chart(canvas, this.config);
    }
  }

  private loadSearchStats(): void {
    this.searchService.getSearchStats().subscribe({
      next: (res) => {
        this.searchStats = res;
        console.log('📊 Search Stats:', res);
      },
      error: (err) => console.error('Error loading search stats:', err)
    });
  }
}
