import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgForOf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-gallery-preview',
  imports: [
    RouterLink,
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './gallery-preview.component.html',
  styleUrl: './gallery-preview.component.css'
})
export class GalleryPreviewComponent {
  images: String[] = [
    'assets/img/home/gallery_preview/raven_bag.jpg',
    'assets/img/home/gallery_preview/moon_breast_collar.jpg',
    'assets/img/home/gallery_preview/sparhawk_armor.jpg',
    'assets/img/home/gallery_preview/custom_guitar_strap.jpg',

    'assets/img/home/gallery_preview/corset.jpg',
    'assets/img/home/gallery_preview/wallets.jpg',
    'assets/img/home/gallery_preview/laptop_bag.jpg',
    'assets/img/home/gallery_preview/set_stone_bracers.jpg',
  ];

  topImages: String[] = this.images.slice(0, 4);
  bottomImages: String[] = this.images.slice(4);
}
