import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ProductDTO } from '../../../dtos/product.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-update-item',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.css']
})
export class UpdateItemComponent implements OnInit {
  itemId!: number;
  product: ProductDTO = {
    productName: '',
    avatar: '',
    cost: 0,
    price: 0,
    description: '',
    categoryId: 0,
  };
  categoryId: number = 0;
  categoryList: Category[] = [];
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.itemId = +params['id'];
    if (this.itemId) {
      this.loadProduct();
    }
  });

  this.loadCategories(); 
}

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: res => this.categoryList = res,
      error: err => console.error('Cannot load categories', err)
    });
  }

  loadProduct() {
    this.productService.detailProduct(this.itemId).subscribe({
      next: (data) => {
        this.product = {
          productName: data.productName,
          cost: data.cost,
          price: data.price,
          avatar: data.avatar,
          description: data.description,
          categoryId: 0,
        };
        this.previewImage = data.avatar;
      },
      error: err => console.error(err)
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
        this.product.avatar = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProduct(): void {
    this.productService.updateProduct(this.itemId, this.product).subscribe({
      next: () => {
        alert('Product updated successfully');
        this.router.navigate(['/detail-item', this.itemId]);
      },
      error: err => {
        console.error('Update failed', err);
        alert('Update failed');
      }
    });
  }
}
