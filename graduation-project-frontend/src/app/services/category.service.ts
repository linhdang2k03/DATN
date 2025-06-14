import { CategoryDTO } from './../dtos/category.dto';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { HttpService } from './http.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiBase = `${environment.apiBaseUrl}/category/admin`;

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) {}

  // Tạo danh mục
  createCategory(categoryDTO: CategoryDTO): Observable<void> {
    return this.http.post<void>(
      `${this.apiBase}/create`,
      categoryDTO,
      { headers: this.httpService.createHeaders() }
    );
  }

  //Sửa danh mục
  updateCategory(id: number, categoryDTO: CategoryDTO, userId: number): Observable<Category> {
    const url = `${this.apiBase}/update/${id}`;
    const params = new HttpParams().set('userId', userId);
    return this.http.put<Category>(url, categoryDTO, { params });
  }

  // Lấy tất cả danh mục
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.apiBase}/fetch`,
      { headers: this.httpService.createHeaders() }
    );
  }

  // Xoá danh mục
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiBase}/delete/${id}`,
      { headers: this.httpService.createHeaders() }
    );
  }

  // Gán người quản lý cho danh mục
  updateAssignment(categoryId: number, managerId: number): Observable<void> {
    const params = new HttpParams()
      .set('id', categoryId.toString())
      .set('managerId', managerId.toString());

    return this.http.post<void>(
      `${this.apiBase}/assignManager`,
      {},
      {
        headers: this.httpService.createHeaders(),
        params
      }
    );
  }

  // Lấy danh sách danh mục theo ID người quản lý (nếu cần)
  getCategoriesByManager(managerId: number): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.apiBase}/fetch/manager/${managerId}`,
      { headers: this.httpService.createHeaders() }
    );
  }
}
