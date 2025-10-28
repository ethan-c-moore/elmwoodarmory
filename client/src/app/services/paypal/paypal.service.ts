import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private baseURL: string = '/api/paypal';

  constructor() { }
}
