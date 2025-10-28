import { Component, OnInit } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {CartService} from '../../services/cart/cart.service';
import {CartItem} from '../../services/cart/cart-item.interface';
import {NgIf, NgFor} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf,
    NgFor
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  showCartDropdown: boolean = false;

  constructor(private cartService: CartService, public router: Router) {}

  ngOnInit() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.calculateCartTotal();
    })
  }

  toggleCartDropdown() {
    this.showCartDropdown = !this.showCartDropdown;
  }

  calculateCartTotal() {
    this.cartTotal = this.cartItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  }

  removeCartItem(index: number) {
    this.cartService.removeItem(index).subscribe();
  }
}
