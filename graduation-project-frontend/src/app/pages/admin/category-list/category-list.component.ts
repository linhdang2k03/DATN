// category-list.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SearchBarComponent } from '../../../components/search-bar/search-bar.component';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { RoleService } from '../../../services/role.service'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; 
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { CategoryDTO } from '../../../dtos/category.dto';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-admin-list',
  standalone: true,
  imports: [
    FormsModule,
    SearchBarComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListAdminComponent implements OnInit {
  list: Category[] = [];
  showCreateForm = false;
  showEditForm = false;
  selectedCategory: Category | null = null;
  newCategory: CategoryDTO = { name: '' };
  editors: User[] = [];

  filter = {
    sortBy: '',
    order: 'descending',
    quantity: 10
  };

  sortBy = [
    { id: 'id', name: 'ID' },
    { id: 'name', name: 'Name' },
    { id: 'assignment', name: 'Assignment' }
  ];

  order = [
    { id: 'ascending', name: 'Ascending' },
    { id: 'descending', name: 'Descending' }
  ];

  minList = 0;
  maxList = this.calMax();
  isMin = false;
  isMax = false;

  constructor(
    private categoryService: CategoryService,
    private roleService: RoleService,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getCategoryList();
    this.fetchUsers();
  }

  getCategoryList(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (category: Category[]) => {
        this.list = category;
        this.onFilterChange();
        this.setMinMin();
      },
      error: (error) => console.error('Error fetching categories', error)
    });
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.editors = users.filter(user => user.role === 'EDITOR');
      },
      error: (error) => console.error('Error fetching users', error)
    });
  }

  getNameByManagerId(managerId: number): string {
    const manager = this.editors.find(user => user.id === managerId);
    return manager ? manager.userName : 'Unknown';
  }

  onFilterChange(): void {
    const { sortBy, order } = this.filter;
    if (sortBy === 'name') {
      this.list.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return order === 'ascending' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
    } else if (sortBy === 'assignment') {
      this.list.sort((a, b) => {
        const managerA = this.getNameByManagerId(a.managerId).toLowerCase();
        const managerB = this.getNameByManagerId(b.managerId).toLowerCase();
        return order === 'ascending' ? managerA.localeCompare(managerB) : managerB.localeCompare(managerA);
      });
    } else if (sortBy === 'id') {
      this.list.sort((a, b) => order === 'ascending' ? a.id - b.id : b.id - a.id);
    }
    this.setMinMin();
  }

  createCategory(): void {
    if (!this.newCategory.name.trim()) return;
    this.categoryService.createCategory(this.newCategory).subscribe({
      next: () => {
        this.newCategory = { name: '' };
        this.showCreateForm = false;
        this.getCategoryList();
      },
      error: (err) => console.error('Create failed:', err)
    });
  }

  openEditForm(category: Category) {
    this.selectedCategory = { ...category };
    this.showEditForm = true;
  }

  saveEditedCategory(): void {
    if (!this.selectedCategory) return;
    const dto: CategoryDTO = { name: this.selectedCategory.name };
    this.categoryService.updateCategory(this.selectedCategory.id, dto, this.selectedCategory.managerId).subscribe({
      next: () => {
        this.showEditForm = false;
        this.getCategoryList();
      },
      error: (err) => console.error('Update failed:', err)
    });
  }

  deleteCategory(categoryId: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: () => this.list = this.list.filter(c => c.id !== categoryId),
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  onManagerChange(event: Event, categoryId: number): void {
    const target = event.target as HTMLSelectElement;
    const managerId = Number(target.value);
    if (!isNaN(managerId)) {
      this.categoryService.updateAssignment(categoryId, managerId).subscribe();
    }
  }

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

  onKeywordChange(keyword: string): void {
    const lowerKeyword = keyword.toLowerCase();
    this.list = this.list.filter(item => item.name.toLowerCase().includes(lowerKeyword));

    this.setMinMin();
  }

}
