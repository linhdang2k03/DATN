import { Category } from './../../../models/category';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from "../../../components/search-bar/search-bar.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-user-list',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    RouterModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListUserComponent implements OnInit {
  categoryId: number = 0;
  list: Product[] = [];
  categoryName: string = '';
  category: Category[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.categoryId = params['id'] ? +params['id'] : 0;
    });
    this.loadCategoryName();
    this.getProducts();
  }

  getDiscount(cost: number | undefined, price: number | undefined): number {
    if (!cost || !price || cost <= price) return 0;
    return Math.round(((cost - price) / cost) * 100);
  }

  getAvatar(avatar: string): string {
    if (!avatar) {
      return 'assets/img/item.png';
    }
    if (avatar.startsWith('data:image')) {
      return avatar;
    }
    return 'data:image/jpeg;base64,' + avatar;
  }

  loadCategoryName() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        this.category = categories;
        const matched = categories.find(cat => cat.id === this.categoryId);
        this.categoryName = matched ? matched.name : 'Unknown Category';
      },
      error: () => {
        this.categoryName = 'Unknown Category';
      }
    });
  }

  getProducts() {
    this.productService.getProducts(this.categoryId).subscribe({
      next: (product: Product[]) => {
        this.list = product;
        this.setMinMin();
      },
      error: (error: any) => {
        console.error('Error fetching product list:', error);
      }
    });
  }

  filter = {
    sortBy: '',
    order: 'descending',
    from: 0,
    to: 5,
    quantity: 10
  };

  sortBy = [
    { id: '', name: 'Newest' },
    { id: 'name', name: 'Name' },
    { id: 'score', name: 'Score' }
  ];

  order = [
    { id: 'ascending', name: 'Ascending' },
    { id: 'descending', name: 'Descending' }
  ];

  minList = 0;
  maxList = this.calMax();
  isMin = false;
  isMax = false;
  indexList = 0;

  calMax() {
    return this.list.length - this.minList > 12 ? this.minList + 12 : this.list.length;
  }

  getLimited() {
    return this.list.slice(this.minList, this.maxList);
  }

  setMinDown() {
    this.minList -= 12;
    this.maxList = this.calMax();
    this.checkIsMin();
    this.checkIsMax();
  }

  setMinUp() {
    this.minList += 12;
    this.maxList = this.calMax();
    this.checkIsMin();
    this.checkIsMax();
  }

  setMinMin() {
    this.minList = 0;
    this.maxList = this.calMax();
    this.checkIsMin();
    this.checkIsMax();
  }

  setMinMax() {
    while (this.list.length - this.minList > 12) {
      this.minList += 12;
    }
    this.maxList = this.calMax();
    this.checkIsMin();
    this.checkIsMax();
  }

  checkIsMin() {
    this.isMin = this.minList <= 0;
  }

  checkIsMax() {
    this.isMax = this.maxList >= this.list.length;
  }
}
