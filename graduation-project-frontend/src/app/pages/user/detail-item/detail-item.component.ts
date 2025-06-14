import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { SearchService } from '../../../services/search.service';
import { Product } from '../../../models/product';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-detail-item',
  standalone: true,
  imports: [
    CommonModule,      
    FormsModule,         
    RouterModule,   
    CurrencyPipe 
  ],
  templateUrl: './detail-item.component.html',
  styleUrl: './detail-item.component.css'
})
export class DetailItemUserComponent implements OnInit {
  itemId: number = 0;
  productDetail: Product | null = null;
  safeAvatar: SafeUrl = 'assets/img/item.png';
  relatedProducts: Product[] = [];
  aiRecommendedProducts: Product[] = [];

  @ViewChild('relatedScroll') relatedScrollRef!: ElementRef;
  @ViewChild('aiScroll') aiScrollRef!: ElementRef;
  isDragging = { related: false, ai: false };
  startX = 0;
  scrollLeft = 0;
  ngAfterViewInit(): void {
    this.autoScroll('relatedScrollRef');
    this.autoScroll('aiScrollRef');
  }

  autoScroll(refName: 'relatedScrollRef' | 'aiScrollRef') {
  const scrollElement = this[refName].nativeElement;
  setInterval(() => {
    scrollElement.scrollBy({ left: 200, behavior: 'smooth' });
  }, 4000); 
}

onDragStart(event: MouseEvent, type: 'related' | 'ai') {
  this.isDragging[type] = true;
  const scroll = this.getScrollRef(type).nativeElement;
  this.startX = event.pageX - scroll.offsetLeft;
  this.scrollLeft = scroll.scrollLeft;
}

onDragMove(event: MouseEvent, type: 'related' | 'ai') {
  if (!this.isDragging[type]) return;
  event.preventDefault();
  const scroll = this.getScrollRef(type).nativeElement;
  const x = event.pageX - scroll.offsetLeft;
  const walk = (x - this.startX) * 0.5; 
  scroll.scrollLeft = this.scrollLeft - walk;
}

onDragEnd(type: 'related' | 'ai') {
  this.isDragging[type] = false;
}

getScrollRef(type: 'related' | 'ai'): ElementRef {
  return type === 'related' ? this.relatedScrollRef : this.aiScrollRef;
}

  comments = [
    {
      username: 'John Doe',
      content: 'Quality products, carefully packaged!',
      rating: 5,
      createdAt: '20/05/2025'
    },
    {
      username: 'Kevin Bruny',
      content: 'Price is a bit high but works well',
      rating: 4,
      createdAt: '19/05/2025'
    }
  ];

  newComment = {
    username: 'Me',
    content: '',
    rating: 5
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private searchService: SearchService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
    const id = +params['itemId'] || 0;
    const name = params['itemName'] || '';

    if (id !== this.itemId) {
      this.itemId = id;
      this.getProductDetail(name); 
    }
});

  }

  getProductDetail(nameFromRoute: string) {
  this.productService.detailProduct(this.itemId).subscribe({
    next: (res: Product) => {
      this.productDetail = res;
      this.safeAvatar = this.getAvatar(res.avatar);

      // Gợi ý theo danh mục
      if (res.category?.id) {
        this.loadRelatedProducts(res.category.id);
      }

      // Gợi ý AI chính xác theo tên từ route
      const keyword = nameFromRoute || res.productName;
      this.searchService.getRecommendations(keyword).subscribe({
        next: (data: Product[]) => {
          this.aiRecommendedProducts = data.filter(p => p.id !== this.itemId);
          console.log('AI gợi ý:', this.aiRecommendedProducts);
          this.cdr.detectChanges();
        }
      });
    }
  });
}


  loadRelatedProducts(categoryId: number) {
    this.productService.getProducts(categoryId).subscribe({
      next: (res: Product[]) => {
        this.relatedProducts = res.filter(p => p.id !== this.itemId);
        if (this.relatedProducts.length === 0 && res.length === 1) {
          this.relatedProducts = res;
        }
      },
      error: err => console.error('Lỗi load related products:', err)
    });
  }

  getAvatar(base64: string): SafeUrl {
    if (!base64) return 'assets/img/item.png';
    if (!base64.startsWith('data:image')) {
      base64 = 'data:image/jpeg;base64,' + base64;
    }
    return this.sanitizer.bypassSecurityTrustUrl(base64);
  }

  submitComment() {
    if (!this.newComment.content.trim()) return;
    this.comments.unshift({
      username: this.newComment.username,
      content: this.newComment.content,
      rating: this.newComment.rating,
      createdAt: new Date().toLocaleDateString('vi-VN')
    });
    this.newComment.content = '';
    this.newComment.rating = 5;
  }

  trackById(index: number, item: Product): number {
    return item.id;
  }
}
