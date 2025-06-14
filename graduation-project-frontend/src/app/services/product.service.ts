import { User } from './../models/user';
import { ProductDTO } from './../dtos/product.dto';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { HttpService } from "./http.service";
import { Injectable } from "@angular/core";
import { Product } from "../models/product";


@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiProduct = `${environment.apiBaseUrl}/product`;

    constructor(private http: HttpClient,
        private httpService: HttpService
    ) { }

    private apiConfig = {
        headers: this.httpService.createHeaders(),
    }

    //lấy toàn bộ product
    getAllProducts(): Observable<Product[]> {
        const url = `${this.apiProduct}/fetchAll`;
        return this.http.get<Product[]>(url, this.apiConfig);
    }


    // hàm tạo product mới 
    createProduct(categoryId: number, productDTO: ProductDTO): Observable<any> {
        const url = `${this.apiProduct}/${categoryId}`;
        return this.http.post(url, productDTO, this.apiConfig);
    }

    // lấy product theo category
    getProducts(categoryId: number): Observable<Product[]> {
        const url = `${this.apiProduct}/fetchAll/${categoryId}`;
        return this.http.get<Product[]>(url, this.apiConfig);
    }

    // update product theo id 
    updateProduct(itemId: number, productDTO: ProductDTO): Observable<any> {
        const url = `${this.apiProduct}/update/${itemId}`;
        return this.http.put(url, productDTO, this.apiConfig);
    }

    // lấy product detail 
    detailProduct(itemId: number): Observable<Product> {
        const url = `${this.apiProduct}/fetch/${itemId}`;
        return this.http.get<Product>(url, this.apiConfig);
    }

    deleteProduct(id: number): Observable<void> {
        const url = `${this.apiProduct}/delete/${id}`;
        return this.http.delete<void>(url, this.apiConfig);
    }
}