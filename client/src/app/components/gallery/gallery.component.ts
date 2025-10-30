import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import {NgClass, NgForOf, NgIf, NgOptimizedImage, TitleCasePipe} from '@angular/common';

interface GalleryImage {
  src: string;
  tags: string[];
  sortOrder: number;
  customClass?: string;
}

@Component({
  selector: 'app-gallery',
  imports: [
    HeaderComponent,
    FooterComponent,
    NgForOf,
    NgOptimizedImage,
    NgClass,
    TitleCasePipe,
    NgIf
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  constructor(private titleService: Title) {
    this.titleService.setTitle("Gallery - Elmwood Armory");
  }

  @ViewChildren("tagCheckbox") checkboxes!: QueryList<ElementRef<HTMLInputElement>>;

  ngOnInit() {
    this.shuffleGalleryImages();
  }

  //shuffle gallery images array to randomize display
  shuffleGalleryImages() {
    for (let i = this.galleryImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.galleryImages[i], this.galleryImages[j]] = [this.galleryImages[j], this.galleryImages[i]];
    }
  }

  //set for tags that are selected in the filter
  selectedTags = new Set<string>();

  //get unique tags of displayed images
  get uniqueTags(): string[] {
    if (this.selectedTags.size === 0) {
      const allTags = this.galleryImages.flatMap((img: { tags: string[] }) => img.tags);
      return Array.from(new Set(allTags)).sort((a, b) => a.localeCompare(b));
    }

    const filtered = this.filteredImages;

    if (filtered.length === 0) return [];

    const commonTags = filtered.flatMap((img: { tags: string[] }) => img.tags);

    return Array.from(new Set(commonTags)).sort((a, b) => a.localeCompare(b));
  }

  //toggle a tag in the filter
  toggleTag(tag: string): void {
    if (this.selectedTags.has(tag)) {
      this.selectedTags.delete(tag);
    } else {
      this.selectedTags.add(tag);
    }
  }

  //get images from gallery images according to selected tags
  get filteredImages(): GalleryImage[] {
    if (this.selectedTags.size === 0) return this.galleryImages;

    return this.galleryImages.filter(img => Array.from(this.selectedTags).every(tag => img.tags.includes(tag)));
  }

  // Add to your class
  get hasSelections(): boolean {
    return this.selectedTags.size > 0;
  }

  clearFilters(): void {
    this.selectedTags.clear();
    this.checkboxes.forEach(checkbox => checkbox.nativeElement.checked = false);
  }

  //static array of gallery images
  //TODO: replace this with a GET from MongoDB
  galleryImages: GalleryImage[] = [
    {
      src: 'antler_shoulder_bag.jpg',
      tags: [
        'bags', 'tooling'
      ],
      sortOrder: 0,
      customClass: 'tall'
    },
    {
      src: 'artemis_belt.jpg',
      tags: [
        'belts', 'tooling', 'custom'
      ],
      sortOrder: 0
    },
    {
      src: 'basket_weave_satchel.jpg',
      tags: [
        'bags', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'blue_scale_bracers.jpg',
      tags: [
        'bracers', 'armor'
      ],
      sortOrder: 0
    },
    {
      src: 'clockwork_satchel.jpg',
      tags: [
        'bags', 'tooling', 'custom'
      ],
      sortOrder: 0
    },
    {
      src: 'closed_pouch_collection.jpg',
      tags: [
        'pouches'
      ],
      sortOrder: 0
    },
    {
      src: 'compass_bracers.jpg',
      tags: [
        'armor', 'bracers', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'custom_allegro_headstall.jpg',
      tags: [
        'horse tack', 'tooling', 'custom'
      ],
      sortOrder: 0
    },
    {
      src: 'pony_breast_collar.jpg',
      tags: [
        'custom', 'horse tack', 'tooling'
      ],
      sortOrder: 0,
      customClass: 'wide'
    },
    {
      src: 'custom_dog_collar.jpg',
      tags: [
        'custom', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'custom_dog_collar_pippin.jpg',
      tags: [
        'custom', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'custom_dragon_satchel.jpg',
      tags: [
        'bags', 'custom', 'tooling'
      ],
      sortOrder: 0,
      customClass: 'tall'
    },
    {
      src: 'headstall.jpg',
      tags: [
        'horse tack'
      ],
      sortOrder: 0,
      customClass: 'tall'
    },
    {
      src: 'custom_knotwork_belt.jpg',
      tags: [
        'custom', 'tooling', 'belts', 'knotwork'
      ],
      sortOrder: 0
    },
    {
      src: 'custom_knotwork_guitar_strap.jpg',
      tags: [
        'custom', 'tooling', 'knotwork'
      ],
      sortOrder: 0
    },
    {
      src: 'custom_pouch.jpg',
      tags: [
        'pouches', 'custom', 'tooling'
      ],
      sortOrder: 0,
      customClass: 'tall'
    },
    {
      src: 'custom_scripture_case.jpg',
      tags: [
        'custom', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'custom_scripture_case_open.jpg',
      tags: [
        'custom', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'dual_scale_bracers.jpg',
      tags: [
        'armor', 'bracers'
      ],
      sortOrder: 0
    },
    {
      src: 'eagle_scout_belt.jpg',
      tags: [
        'custom', 'belts'
      ],
      sortOrder: 0
    },
    {
      src: 'elder_futhark_belt.jpg',
      tags: [
        'custom', 'belts'
      ],
      sortOrder: 0
    },
    {
      src: 'feather_bracers.jpg',
      tags: [
        'armor', 'bracers', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'flower_satchel.jpg',
      tags: [
        'custom', 'bags', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'freedom_satchel.jpg',
      tags: [
        'custom', 'bags', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'hatchet_sheath.jpg',
      tags: [
        'custom', 'sheaths', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'huginn_muninn_raven_satchel.jpg',
      tags: [
        'tooling', 'bags'
      ],
      sortOrder: 0
    },
    {
      src: 'jelling_knotwork_bracers.jpg',
      tags: [
        'armor', 'bracers', 'tooling', 'knotwork'
      ],
      sortOrder: 0
    },
    {
      src: 'knight_shoulder_pouch.jpg',
      tags: [
        'bags', 'tooling'
      ],
      sortOrder: 0,
      customClass: 'tall'
    },
    {
      src: 'knotwork_belt.jpg',
      tags: [
        'custom', 'belts', 'knotwork', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'knotwork_belt_pouch.jpg',
      tags: [
        'pouches', 'knotwork', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'knotwork_quiver.jpg',
      tags: [
        'knotwork', 'tooling', 'quivers'
      ],
      sortOrder: 0
    },
    {
      src: 'knotwork_shoulder_bag.jpg',
      tags: [
        'bags', 'tooling', 'knotwork'
      ],
      sortOrder: 0
    },
    {
      src: 'laptop_satchel.jpg',
      tags: [
        'custom', 'bags'
      ],
      sortOrder: 0
    },
    {
      src: 'laptop_satchel_stitched.jpg',
      tags: [
        'custom', 'bags'
      ],
      sortOrder: 0
    },
    {
      src: 'latigo_shoulder_bag.jpg',
      tags: [
        'bags'
      ],
      sortOrder: 0
    },
    {
      src: 'little_red_corset.jpg',
      tags: [
        'corsets', 'knotwork', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'lovecraft_bracers.jpg',
      tags: [
        'armor', 'bracers', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'maple_belt_pouch.jpg',
      tags: [
        'pouches'
      ],
      sortOrder: 0
    },
    {
      src: 'maple_bracers.jpg',
      tags: [
        'armor', 'bracers'
      ],
      sortOrder: 0
    },
    {
      src: 'maple_satchel.jpg',
      tags: [
        'bags'
      ],
      sortOrder: 0
    },
    {
      src: 'moon_and_feather_breast_collar.jpg',
      tags: [
        'horse tack', 'tooling'
      ],
      sortOrder: 0,
      customClass: 'wide'
    },
    {
      src: 'nautical_armor.jpg',
      tags: [
        'armor', 'belts', 'tooling'
      ],
      sortOrder: 0,
      customClass: 'tall'
    },
    {
      src: 'oxblood_pouch.jpg',
      tags: [
        'pouches'
      ],
      sortOrder: 0
    },
    {
      src: 'phoenix_breastplate.jpg',
      tags: [
        'armor', 'tooling'
      ],
      sortOrder: 0,
      customClass: 'tall'
    },
    {
      src: 'pirate_cuffs.jpg',
      tags: [
        'custom', 'armor', 'bracers', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'purple_maple_belt_pouch.jpg',
      tags: [
        'pouches', 'custom'
      ],
      sortOrder: 0
    },
    {
      src: 'quincy_shoulder_pad.jpg',
      tags: [
        'pauldrons', 'custom', 'armor', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'quincy_shoulder_pad_worn.jpg',
      tags: [
        'pauldrons', 'armor', 'custom', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'raven_satchel.jpg',
      tags: [
        'bags', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'red_flower_bracers.jpg',
      tags: [
        'custom', 'armor', 'bracers', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'red_scale_bracers.jpg',
      tags: [
        'armor', 'bracers', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'saddle_shoulder_pad.jpg',
      tags: [
        'custom', 'pauldrons'
      ],
      sortOrder: 0
    },
    {
      src: 'scale_quiver.jpg',
      tags: [
        'quivers'
      ],
      sortOrder: 0
    },
    {
      src: 'scaled_belt_pouch.jpg',
      tags: [
        'pouches'
      ],
      sortOrder: 0
    },
    {
      src: 'serpent_archery_bracer.jpg',
      tags: [
        'armor', 'bracers', 'tooling', 'knotwork'
      ],
      sortOrder: 0
    },
    {
      src: 'setstone_bracer.jpg',
      tags: [
        'armor', 'bracers', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'sigrun_armor.JPG',
      tags: [
        'armor', 'pauldrons', 'belts', 'tooling', 'knotwork', 'custom'
      ],
      sortOrder: 0,
      customClass: 'tall'
    },
    {
      src: 'simple_headstall.jpg',
      tags: [
        'horse tack'
      ],
      sortOrder: 0
    },
    {
      src: 'skull_and_serpent_bracer.jpg',
      tags: [
        'armor', 'tooling', 'bracers', 'custom'
      ],
      sortOrder: 0,
      customClass: 'tall'
    },
    {
      src: 'sparhawk_armor.jpg',
      tags: [
        'armor', 'custom', 'pauldrons', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'stand_up_girls_state_portfolio_cover.jpg',
      tags: [
        'custom', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'straightrazor_sheath.jpg',
      tags: [
        'sheaths', 'custom'
      ],
      sortOrder: 0
    },
    {
      src: 'tooled_belt.jpg',
      tags: [
        'custom', 'belts', 'knotwork', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'tooled_boat_and_serpent.jpg',
      tags: [
        'knotwork', 'tooling'
      ],
      sortOrder: 0,
      customClass: 'wide'
    },
    {
      src: 'treble_bracers.jpg',
      tags: [
        'custom', 'armor', 'bracers', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'tree_of_life_yggdrasil_satchel.jpg',
      tags: [
        'bags', 'tooling', 'knotwork'
      ],
      sortOrder: 0
    },
    {
      src: 'twin_dragon_satchel.jpg',
      tags: [
        'bags', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'skoll_and_hati_bag.jpg',
      tags: [
        'custom', 'bags', 'tooling', 'knotwork'
      ],
      sortOrder: 0
    },
    {
      src: 'utah_portfolio_cover.jpg',
      tags: [
        'custom', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'vegvisir_wallet.jpg',
      tags: [
        'custom', 'wallets'
      ],
      sortOrder: 0
    },
    {
      src: 'wallet_collection.jpg',
      tags: [
        'wallets', 'wallets', 'wallets', 'wallets', 'wallets', 'wallets'
      ],
      sortOrder: 0
    },
    {
      src: 'water_buffalo_satchel.jpg',
      tags: [
        'bags'
      ],
      sortOrder: 0
    },
    {
      src: 'wedding_corset_belt.jpg',
      tags: [
        'custom', 'belts', 'corsets', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'woodgrain_bracers.jpg',
      tags: [
        'armor', 'bracers', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'woodgrain_shoulder_pad.jpg',
      tags: [
        'armor', 'tooling', 'pauldrons'
      ],
      sortOrder: 0
    },
    {
      src: 'antler_wallet.jpg',
      tags: [
        'wallets', 'tooling', 'custom'
      ],
      sortOrder: 0
    },
    {
      src: 'brown_wallet.jpg',
      tags: [
        'wallets'
      ],
      sortOrder: 0
    },
    {
      src: 'circuit_belt.jpg',
      tags: [
        'custom', 'belts', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'cosplay_bracers.jpg',
      tags: [
        'custom', 'armor', 'bracers'
      ],
      sortOrder: 0
    },
    {
      src: 'dagger_sheath.jpeg',
      tags: [
        'sheaths', 'tooling', 'custom'
      ],
      sortOrder: 0
    },
    {
      src: 'long_wallet.jpg',
      tags: [
        'wallets'
      ],
      sortOrder: 0
    },
    {
      src: 'mountain_bag.jpg',
      tags: [
        'bags', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'pouch_and_bracers.jpg',
      tags: [
        'pouches', 'bracers', 'armor'
      ],
      sortOrder: 0
    },
    {
      src: 'slim_wallet.jpg',
      tags: [
        'wallets'
      ],
      sortOrder: 0
    },
    {
      src: 'tooele_soccer_wallets.jpg',
      tags: [
        'custom', 'wallets', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'ulak_sheaths.jpg',
      tags: [
        'custom', 'sheaths', 'tooling'
      ],
      sortOrder: 0
    },
    {
      src: 'volcano_bag.jpg',
      tags: [
        'bags'
      ],
      sortOrder: 0
    },
  ];
}
