import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.css',
})
export class SearchResultsComponent implements OnInit {
  searchKeyword: string = '';
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    
    this.loadResults();

    // Theo dõi thay đổi route để reload nếu keyword thay đổi
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadResults();
      });
  }

  loadResults(): void {
    const nav = this.router.getCurrentNavigation();
    const stateData = nav?.extras?.state as { keyword: string; products: Product[] };

    this.route.queryParams.subscribe(params => {
      this.searchKeyword = params['keyword'] || '';

      if (stateData && stateData.products) {
        this.products = stateData.products;
      } else {
        this.searchService.searchByKeyword(this.searchKeyword).subscribe({
          next: (res) => {
            this.products = res;
          },
          error: () => {
            this.products = [];
          }
        });
      }
    });
  }
}

