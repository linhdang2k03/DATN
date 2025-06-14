import { SearchService } from './../../../services/search.service';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  recommendedProducts: Product[] = [];

  constructor(private SearchService: SearchService) {}

  ngOnInit() {
    this.SearchService.getRecommendations().subscribe({
      next: res => this.recommendedProducts = res,
      error: err => console.error('Recommendation error:', err)
    });
  }

}