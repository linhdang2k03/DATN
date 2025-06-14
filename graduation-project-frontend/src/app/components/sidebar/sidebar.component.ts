import { CategoryService } from './../../services/category.service';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SessionService } from '../../services/session.service';
import { LocalService } from '../../services/local.service';
import { Category } from '../../models/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(
    private sessionStore: SessionService,
    private localstore: LocalService,
    private categoryService: CategoryService,
  ) {}
  
  @Input() role: number = -1;
  idCard = this.localstore.get('idCard');
  categoryList: Category[] = [];

  isLogged = this.sessionStore.get('isLogged');
  ngOnInit(): void {
    this.getCategoryList();
  }
  getCategoryList() {
    this.categoryService.getAllCategories().subscribe({
      next: (category: Category[]) => {
        this.categoryList = category;
        console.log(this.categoryList);
      },
      complete: () => {
      },
      error: (error: any) => {
  
      }
    });
  }

}
