import { Component } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-about',
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle("About - Elmwood Armory");
  }
}
