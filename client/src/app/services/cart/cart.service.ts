import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import { CartItem } from './cart-item.interface';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = '/api/cart';
  private cartSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshCart().subscribe();
  }

  getCart(): Observable<CartItem[]> {
    return this.cart$;
  }

  refreshCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.baseUrl, {withCredentials: true}).pipe(tap(items => this.cartSubject.next(items)));
  }

  addToCart(item: CartItem): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, item, {withCredentials: true}).pipe(switchMap(() => this.refreshCart()));
  }

  removeItem(index: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${index}`, {withCredentials: true}).pipe(switchMap(() => this.refreshCart()));
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clear`, {withCredentials: true}).pipe(switchMap(() => this.refreshCart()));
  }
}
