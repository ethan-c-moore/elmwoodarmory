import {AfterViewInit, Component} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {NgFor, NgIf, NgClass, NgOptimizedImage} from '@angular/common';
import Swiper from 'swiper';
import { Navigation, EffectCoverflow } from 'swiper/modules';

import {ProductInterface, products} from '../../data/product.interface';
import {CartService} from '../../services/cart/cart.service';
import {CartItem} from '../../services/cart/cart-item.interface';

@Component({
  selector: 'app-product',
  imports: [
    HeaderComponent,
    FooterComponent,
    NgClass,
    NgFor,
    NgIf,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements AfterViewInit {

  protected readonly Object = Object;

  path: string | null = '';
  importedProduct!: ProductInterface;
  selectedOptions: {[key: string]: string} = {};
  finalPrice: number = 0;
  itemAdded: boolean = false;
  swiper: Swiper | null = null;

  constructor(private titleService: Title, private router: Router, private activatedRoute: ActivatedRoute, private cartService: CartService, private sanitizer: DomSanitizer) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.path = params.get('path');
      const found = products.find(p => p.path == this.path);
      if (!found) {
        alert("ProductInterface failed to load.");
        this.router.navigate(['/shop']);
        return;
      }

      this.importedProduct = found;
    });

    this.titleService.setTitle(`${this.importedProduct.name} - Elmwood Armory`);
    this.setDefaultOptions();
    this.updatePrice();
  }

  ngAfterViewInit() {
    this.swiper = new Swiper('.swiper', {
      modules: [Navigation, EffectCoverflow],
      slidesPerView: 3,
      centeredSlides: true,
      loop: true,
      speed: 450,
      grabCursor: true,
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 150,
        modifier: 1,
        slideShadows: false
      },
      navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next'
      },
      breakpoints: {
        0: {slidesPerView: 1, centeredSlides: true},
        640: {slidesPerView: 3, centeredSlides: true}
      }
    });
  }

  setDefaultOptions() {
    for (const [key, opt] of Object.entries(this.importedProduct.options)) {
      const values = Object.keys(opt.values);
      this.selectedOptions[key] = values[0];
    }
  }

  updateOption(group: string, value: string) {
    this.selectedOptions[group] = value;
    this.updatePrice();

    if (this.swiper !== null && this.importedProduct.options[group].values[value].images !== undefined && this.importedProduct.options[group].values[value].images.length > 0) {
      this.swiper.slideToLoop(this.importedProduct.images.indexOf(this.importedProduct.options[group].values[value].images[0]), 450, false);
    }
  }

  updatePrice() {
    let price = this.importedProduct.startingAt;
    for (const [key, selectedValue] of Object.entries(this.selectedOptions)) {
      const group = this.importedProduct.options[key];
      if (group.cost) {
        const item = group.values[selectedValue];
        price = <number>item.price;
      }
    }
    this.finalPrice = price;
  }

  getPriceDifference(groupKey: string, valueKey: string): number | null {
    const group = this.importedProduct.options[groupKey];
    if (group.cost) {
      const price = group.values[valueKey].price;
      const selectedKey = this.selectedOptions[groupKey];
      const selected = group.values[selectedKey];
      if (!selected || typeof selected.price !== 'number') return null;
      return <number>price - selected.price;
    }
    return null;
  }

  formatPriceDiff(groupKey: string, valueKey: string): string {
    const diff = this.getPriceDifference(groupKey, valueKey);
    if (diff == null) return '';
    const sign = diff >= 0 ? '+' : '-';
    const abs = Math.abs(diff);
    // round to whole dollars like your pipe did
    const whole = Math.round(abs);
    return ` (${sign}$${whole})`;
  }

  getSafeDescription(description: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }

  addCurrentProductToCart() {
    const item: CartItem = {
      productId: this.importedProduct.id,
      name: this.importedProduct.name,
      basePrice: this.importedProduct.startingAt,
      selectedOptions: { ...this.selectedOptions },
      finalPrice: this.finalPrice,
      quantity: 1
    };

    this.cartService.addToCart(item).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      }
    });

    this.itemAdded = true;
  }

  customizeProduct() {
    const message = this.buildCustomizationMessage();

    sessionStorage.setItem('customizationMessage', message);

    this.router.navigate(['/'], {
      fragment: 'contact',
      state: {
        contactPrefill: {
          contactType: 'commission',
          pieceType: 'accessory',
          message
        }
      }
    })
  }

  private buildCustomizationMessage(): string {
    const opts = Object.entries(this.selectedOptions)
      .map(([groupKey, valueKey]) => {
        const group = this.importedProduct.options[groupKey];
        const value = group.values[valueKey];
        return `- ${group.name}: ${value.name}`;
      })
      .join('\n');

    const header = `${this.importedProduct.name}\nSelected Options:\n${opts || '(none)'}`;

    const divider = '----DESCRIBE YOUR CUSTOMIZATIONS BELOW----\n\n';

    return `${header}\n${divider}`;
  }
}
