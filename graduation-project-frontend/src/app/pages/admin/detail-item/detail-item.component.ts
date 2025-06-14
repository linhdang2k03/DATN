import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './detail-item.component.html',
  styleUrls: ['./detail-item.component.css']
})
export class DetailItemComponent implements OnInit {
  itemId: number | null = null;
  productDetail: Product = {
  id: 0,
  productName: '',
  avatar: '',
  cost: 0,
  price: 0,
  startDate: '',
  description: '',
  category: {
    id: 0,
    name: '',
    manager: '',
    managerId: 0,
    managerName: ''
  }
};

  safeAvatar: SafeUrl = 'assets/img/item.png';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.itemId = +params['id'];
      if (this.itemId) {
        this.getProductDetail(this.itemId);
      }
    });
  }

  getProductDetail(id: number) {
    this.productService.detailProduct(id).subscribe({
      next: (response: Product) => {
        this.productDetail = response;
        this.safeAvatar = this.sanitizeBase64Image(response.avatar);
      },
      error: (error) => {
        console.error('Error fetching product detail', error);
      }
    });
  }

  sanitizeBase64Image(base64String: string): SafeUrl {
    if (!base64String?.startsWith('data:image')) {
      base64String = 'data:image/jpeg;base64,' + base64String;
    }
    return this.sanitizer.bypassSecurityTrustUrl(base64String);
  }
}
