import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../../components/search-bar/search-bar.component';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { ProductDTO } from '../../../dtos/product.dto';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';

interface ProductView extends Product {
  safeAvatar?: SafeUrl;
}

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    FormsModule,
    SearchBarComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent implements OnInit {
  list: ProductView[] = [];
  showCreateForm = false;
  newProduct: ProductDTO = {
    productName: '',
    avatar: '',
    description: '',
    cost: 0,
    price: 0,
    categoryId: 0,
  };
  previewImage: string | ArrayBuffer | null = null;
  categoryId: number = 0;
  isAllProductPage = false;
  categoryList: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryList = res;

        this.isAllProductPage = this.router.url.includes('item-list-all');
        if (this.isAllProductPage) {
          this.getAllProducts();
        } else {
          this.route.queryParams.subscribe(params => {
            this.categoryId = params['id'] ? +params['id'] : 0;
            this.getProducts();
          });
        }
      }
    });
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.list = products.map(p => ({
          ...p,
          safeAvatar: this.sanitizer.bypassSecurityTrustUrl(p.avatar) as SafeUrl
        }));
        this.setMinMin();
      },
      error: (err) => console.error('Error loading all products:', err)
    });
  }

  getProducts() {
    this.productService.getProducts(this.categoryId).subscribe({
      next: (products: Product[]) => {
        const category = this.categoryList.find(c => c.id === this.categoryId);

        this.list = products.map(p => ({
          ...p,
          category: category || {
            id: this.categoryId,
            name: 'Unknown',
            manager: '',
            managerId: 0,
            managerName: ''
          },
          safeAvatar: this.sanitizer.bypassSecurityTrustUrl(p.avatar) as SafeUrl
        }));
        this.setMinMin();
      },
      error: (error: any) => {
        console.error('Error fetching products', error);
      }
    });
  }

  createProduct(): void {
    if (!this.newProduct.productName.trim()) {
      alert('Please enter product name');
      return;
    }

    this.productService.createProduct(this.categoryId, this.newProduct).subscribe({
      next: () => {
        alert('Create successful product!');
        this.newProduct = { productName: '', avatar: '', description: '', cost: 0, price: 0, categoryId: 0, };
        this.showCreateForm = false;
        this.previewImage = null;
        this.loadList();
      },
      error: (err) => {
        console.error('Create failed product:', err);
        alert('An error occurred while creating the product!');
      }
    });
  }

  loadList(): void {
    this.isAllProductPage ? this.getAllProducts() : this.getProducts();
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.list = this.list.filter(product => product.id !== productId);
        },
        error: (error) => {
          console.error('Error deleting product', error);
        }
      });
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
        this.newProduct.avatar = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  sanitizeBase64Image(base64String: string): SafeUrl {
    if (!base64String.startsWith('data:image')) {
      base64String = 'data:image/jpeg;base64,' + base64String;
    }
    return this.sanitizer.bypassSecurityTrustUrl(base64String);
  }

  current = {
    day: new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate(),
    month: new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1,
    year: new Date().getFullYear()
  };

  filter = {
    sortBy: '',
    order: 'descending',
    from: '2024-08-01',
    to: `${this.current.year}-${this.current.month}-${this.current.day}`,
    quantity: 10
  };

  sortBy = [
    { id: 'id', name: 'ID' },
    { id: 'productName', name: 'Name' },
    { id: 'cost', name: 'Cost' },
    { id: 'price', name: 'Price' },
  ];

  order = [
    { id: 'ascending', name: 'Ascending' },
    { id: 'descending', name: 'Descending' }
  ];

  minList = 0;
  maxList = this.calMax();
  isMin = false;
  isMax = false;

  calMax() {
    return this.list.length - this.minList > 10 ? this.minList + 10 : this.list.length;
  }

  getLimited() {
    return this.list.slice(this.minList, this.maxList);
  }

  setMinDown() {
    this.minList -= 10;
    this.maxList = this.calMax();
    this.checkIsMin();
    this.checkIsMax();
  }

  setMinUp() {
    this.minList += 10;
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
    while (this.list.length - this.minList > 10) {
      this.minList += 10;
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

  applySort(): void {
    const { sortBy, order } = this.filter;

    if (!sortBy) return;

    this.list.sort((a: any, b: any) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      if (valueA == null || valueB == null) return 0;

      if (order === 'ascending') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });

    this.setMinMin();
  }

  originalList: ProductView[] = [];
  onKeywordChange(keyword: string): void {
  const trimmed = keyword.trim().toLowerCase();

  if (trimmed === '') {
    this.loadList(); 
    return;
  }

  // lọc theo tên sản phẩm
  this.list = this.list.filter(item =>
    item.productName.toLowerCase().includes(trimmed)
  );

  this.setMinMin();
}

}
