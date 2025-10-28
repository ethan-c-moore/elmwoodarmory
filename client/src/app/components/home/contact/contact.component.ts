import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import {HttpClient} from '@angular/common/http';

import { ContactService } from '../../../services/contact/contact.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private contactService: ContactService, private http: HttpClient) {}

  ngOnInit(): void {
      this.contactForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        contactMethod: ['email', Validators.required],
        contactValue: ['', Validators.required],
        contactType: ['', Validators.required],
        requestType: [''],
        pieceType: [''],
        message: ['']
      });

    this.contactForm.get('contactType')!.valueChanges.subscribe((value) => {
      const pieceType = this.contactForm.get('pieceType');
      if (value === 'commission' || value === 'repair') {
        pieceType?.setValidators([Validators.required]);
      } else {
        pieceType?.clearValidators();
        pieceType?.setValue('');
      }
      pieceType?.updateValueAndValidity();
    });

    this.applyPrefill();
  }

  applyPrefill() {
    const statePrefill = (history.state && history.state.contactPrefill) || null;

    let storagePrefill: any = null;
    try {
      storagePrefill = JSON.parse(localStorage.getItem('contactPrefill') || 'null');
    } catch {}

    const prefill = statePrefill || storagePrefill;
    if (!prefill) return;

    if (prefill.contactType) {
      this.contactForm.patchValue({
        contactType: prefill.contactType
      });
    }

    this.contactForm.patchValue({
      requestType: this.contactForm.value.requestType || 'commission',
      pieceType: this.contactForm.value.pieceType || 'accessory',
      message: prefill.message ?? this.contactForm.value.message
    });

    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      const ta = document.querySelector('textarea[formControlName="message"]') as HTMLTextAreaElement;
      ta?.focus();

      if (ta) {
        const len = ta.value.length;
        ta.setSelectionRange(len, len);
      }
    }, 0);
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formValue = this.contactForm.value;

      const payload = {
        contactInfo: {
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          contactType: formValue.contactMethod,
          contactValue: formValue.contactValue
        },
        request: {
          requestType: formValue.requestType,
          message: formValue.message,
          ...(formValue.contactMethod !== 'other' && { pieceType: formValue.pieceType })
        },
        contactDate: new Date(),
        status: [
          {
            code: "new",
            upDate: new Date(),
            message: "Contact request submitted",
            statusOwner: "Application"
          }
        ]
      };

      this.contactService.submitContactForm(payload).subscribe({
        next: (response) => {
          alert("Contact request was submitted! Thank you!");

          this.contactForm.patchValue({
            contactType: 'email'
          });

          this.contactForm.reset();
          this.contactForm.markAsPristine();
          this.contactForm.markAsUntouched();

          console.log("Contact form submitted! :)", response);
        },
        error: (error) => {
          alert("Contact request failed. Please try again.");
          console.log("An oopsie occurred.", error)
        }
      });
    }
  }
}
