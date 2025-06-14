import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  createHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); 
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`); 
    }

    return headers;
  }
}
