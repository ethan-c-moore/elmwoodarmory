import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = '/api/contact';

  constructor(private http: HttpClient) {}

  submitContactForm(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
