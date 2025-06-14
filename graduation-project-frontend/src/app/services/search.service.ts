import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Search } from '../models/search';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = `${environment.apiBaseUrl}/search`;

  constructor(private http: HttpClient) {}

  // 🔐 Hàm tạo headers kèm token nếu có
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // 🔍 Tìm kiếm sản phẩm theo từ khóa
  searchByKeyword(keyword: string): Observable<Product[]> {
    const headers = this.getAuthHeaders();

    if (!headers.has('Authorization')) {
      console.warn('❗ Không có token — yêu cầu tìm kiếm có thể bị từ chối.');
    }

    return this.http.get<Product[]>(`${this.baseUrl}?keyword=${encodeURIComponent(keyword)}`, {
      headers
    });
  }

  // 🧠 Gợi ý sản phẩm từ AI — có thể truyền hoặc không truyền keyword
  getRecommendations(keyword?: string): Observable<Product[]> {
    const headers = this.getAuthHeaders();
    const body = keyword ? { keyword } : {}; // nếu không có keyword, backend sẽ tự lấy theo lịch sử

    return this.http.post<Product[]>(`${this.baseUrl}/recommendations`, body, {
      headers
    });
  }

  getSearchStats(): Observable<Search[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<Search[]>(`${this.baseUrl}/keyword-stats`, { headers });
}

}
