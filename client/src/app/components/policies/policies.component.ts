import { Component } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-policies',
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.css'
})
export class PoliciesComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle("Policies - Elmwood Armory");
  }
}
