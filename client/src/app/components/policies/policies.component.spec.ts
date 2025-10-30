import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliciesComponent } from './policies.component';

import {RouterTestingModule} from '@angular/router/testing';

describe('PoliciesComponent', () => {
  let component: PoliciesComponent;
  let fixture: ComponentFixture<PoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliciesComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
