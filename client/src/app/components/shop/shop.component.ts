import { Component } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';
import {NgForOf, NgOptimizedImage, SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';

import { ProductInterface, products } from '../../data/product.interface';

@Component({
  selector: 'app-shop',
  imports: [
    HeaderComponent,
    FooterComponent,
    NgForOf,
    RouterLink,
    NgOptimizedImage,
    SlicePipe
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {

  products: ProductInterface[] | undefined = undefined;

  constructor(private titleService: Title) {
    this.titleService.setTitle("Shop - Elmwood Armory");
    this.products = products;
  }
}
