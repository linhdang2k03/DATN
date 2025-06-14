import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from "../../components/search-bar/search-bar.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    FormsModule,
    SearchBarComponent,
    FontAwesomeModule,
    CommonModule,
    RouterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css'
})
export class ExampleComponent implements OnInit {
  categoryName = 'Electronics';
  list: Product[] = [];
  minList = 0;
  maxList = 0;
  isMin = false;
  isMax = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts(0).subscribe({
      next: (product: Product[]) => {
        this.list = product;
        this.setMinMin();
      },
      error: err => console.error(err)
    });
  }

  getAvatar(avatar: string): string {
    if (!avatar) return 'assets/img/item.png';
    return avatar.startsWith('data:image') ? avatar : 'data:image/jpeg;base64,' + avatar;
  }

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
