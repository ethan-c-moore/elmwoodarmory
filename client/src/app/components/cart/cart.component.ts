import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { CartItem } from '../../services/cart/cart-item.interface';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import {products} from '../../data/product.interface';
import {Title} from '@angular/platform-browser';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  productList = products;

  constructor(private cartService: CartService, private titleService: Title) {
    titleService.setTitle("Cart - Elmwood Armory");
  }

  ngOnInit() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  }

  removeItem(index: number) {
    this.cartService.removeItem(index).subscribe();
  }

  clearCart() {
    this.cartService.clearCart().subscribe();
  }
}
