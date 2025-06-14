import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Category } from '../../models/category';
import { LocalService } from '../../services/local.service';
import { SessionService } from '../../services/session.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  categoryList: Category[] = [];
  searchText: string = '';

  @Input() role: number = -1;
  idCard = this.localStore.get('idCard');
  isLogged = this.sessionStore.get('isLogged');

  // Inject Router
  router = inject(Router);

  constructor(
    private localStore: LocalService,
    private sessionStore: SessionService,
    private categoryService: CategoryService,
    private searchService: SearchService 
  ) {}

  ngOnInit() {
    this.getCategoryList();
  }

  onSignOut() {
    this.sessionStore.clear();
    this.router.navigateByUrl('login');
  }

  onSearch() {
    if (!this.searchText.trim()) return;

    this.searchService.searchByKeyword(this.searchText).subscribe({
      next: (res) => {
        this.router.navigate(['/search'], {
          queryParams: {
            keyword: this.searchText
          },
          state: { products: res }
        });
      },
      error: (err) => {
        console.error('Search failed:', err);
      }
    });
  }

  goToCategoryAndReload(categoryId: number): void {
    this.router.navigate(['/category-list-user'], {
      queryParams: { id: categoryId },
    }).then(() => {
      location.reload();
    });
  }

  goToAllProducts(): void {
    this.router.navigate(['/item-list-all']);
  }

  getCategoryList() {
    this.categoryService.getAllCategories().subscribe({
      next: (category: Category[]) => {
        this.categoryList = category;
      },
      error: (error: any) => {
        console.error('Error fetching categories', error);
      }
    });
  }
}
