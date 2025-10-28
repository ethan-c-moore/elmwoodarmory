import {AfterViewInit, Component} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Title } from '@angular/platform-browser';
import { ContactComponent } from './contact/contact.component';
import { GalleryPreviewComponent } from './gallery-preview/gallery-preview.component';
import { EventsComponent } from './events/events.component';
import { NgFor } from '@angular/common';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    GalleryPreviewComponent,
    EventsComponent,
    NgFor
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  constructor(private titleService: Title) {
    this.titleService.setTitle("Home - Elmwood Armory");
  }

  ngAfterViewInit() {
    new Swiper('.swiper', {
      modules: [Autoplay],
      slidesPerView: 1,
      loop: true,
      autoplay: {
        delay: 9000,
        disableOnInteraction: false,
      }
    });
  }

  testimonials = [
    {
      author:'Aleta Boyce',
      testimonial:'"Lalenia\'s work is all handmade and of the best quality... perfect for a commissioned piece. The belt has Elder Futhark runes that make me smile every time I wear it. She delivered on time and made sure I was happy with the purchase. I will be using her belts for a very long time."'
    },
    {
      author:'Brianna Thaxton',
      testimonial:'"I loved my experience shopping with Elmwood Armory. I purchased a wrist guard. They had a wonderful selection of color options with different designs to choose from (all handcrafted) and they even helped me put it on! A perk of shopping in person."'
    },
    {
      author:'Mark Coffield',
      testimonial:'"Lalenia at Elmwood Armory was a pleasure doing business with. She went above and beyond to provide a custom American made product. She designed and manufactured a quality custom halter for my quarter horse. I could not recommend Elmwood Armory more highly.”'
    },
    {
      author:'Marti West',
      testimonial:'"I bought a gorgeous, hand-crafted, leather bag from Lalenia. The detail and craftsmanship are incredible and I’ve gotten so many compliments. I couldn’t believe how affordable it was for such a large piece that must have taken countless hours to complete. You cannot go wrong with one of these products!"'
    }
  ];
}
