import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryPreviewComponent } from './gallery-preview.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('GalleryPreviewComponent', () => {
  let component: GalleryPreviewComponent;
  let fixture: ComponentFixture<GalleryPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryPreviewComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
