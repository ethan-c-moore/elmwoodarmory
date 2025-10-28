import {Component, OnDestroy, OnInit, NgZone} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';
import {CartService} from '../../services/cart/cart.service';
import {CartItem} from '../../services/cart/cart-item.interface';
import {Router, RouterLink} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidationErrors} from '@angular/forms';
import {take} from 'rxjs';
import {Order} from '../../data/order.interface';

declare var paypal: any;

export interface AddressFields {
  addressLine1: string;
  addressLine2: string;
  adminArea1: string;  // State
  adminArea2: string;  // City
  countryCode: string;
  postalCode: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
}

@Component({
  selector: 'app-checkout',
  imports: [
    HeaderComponent,
    FooterComponent,
    NgForOf,
    NgIf,
    FormsModule,
    CurrencyPipe,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  private styleElement?: HTMLStyleElement;
  private scriptElement?: HTMLScriptElement;
  currentCheckoutStep: number = 1;
  payPalSDKReady: boolean  = false;
  payPalInitialized: boolean = false;

  shippingForm!: FormGroup
  billingForm!: FormGroup

  private getShippingModel(): AddressFields {
    const raw = this.shippingForm.getRawValue();
    return {
      addressLine1: raw.addressLine1,
      addressLine2: raw.addressLine2,
      adminArea1: raw.adminArea1,
      adminArea2: raw.adminArea2,
      countryCode: 'US',
      postalCode: raw.postalCode,
      firstName: raw.firstName,
      lastName: raw.lastName,
      phoneNumber: raw.phoneNumber,
      email: raw.email,
    };
  }

  private getBillingModel(): AddressFields {
    const raw = this.billingForm.getRawValue();
    return {
      addressLine1: raw.addressLine1,
      addressLine2: raw.addressLine2,
      adminArea1: raw.adminArea1,
      adminArea2: raw.adminArea2,
      countryCode: 'US',
      postalCode: raw.postalCode,
      firstName: raw.firstName,
      lastName: raw.lastName,
    }
  }

  billingFieldsSnapshot: any = null;

  states: {name: string, value: string}[] = [
    {name: 'Alabama', value: 'AL'},
    {name: 'Alaska', value: 'AK'},
    {name: 'Arizona', value: 'AZ'},
    {name: 'Arkansas', value: 'AR'},
    {name: 'California', value: 'CA'},
    {name: 'Colorado', value: 'CO'},
    {name: 'Connecticut', value: 'CT'},
    {name: 'Delaware', value: 'DE'},
    {name: 'District of Columbia', value: 'DC'},
    {name: 'Florida', value: 'FL'},
    {name: 'Georgia', value: 'GA'},
    {name: 'Hawaii', value: 'HI'},
    {name: 'Idaho', value: 'ID'},
    {name: 'Illinois', value: 'IL'},
    {name: 'Indiana', value: 'IN'},
    {name: 'Iowa', value: 'IA'},
    {name: 'Kansas', value: 'KS'},
    {name: 'Kentucky', value: 'KY'},
    {name: 'Louisiana', value: 'LA'},
    {name: 'Maine', value: 'ME'},
    {name: 'Maryland', value: 'MD'},
    {name: 'Massachusetts', value: 'MA'},
    {name: 'Michigan', value: 'MI'},
    {name: 'Minnesota', value: 'MN'},
    {name: 'Mississippi', value: 'MS'},
    {name: 'Missouri', value: 'MO'},
    {name: 'Montana', value: 'MT'},
    {name: 'Nebraska', value: 'NE'},
    {name: 'Nevada', value: 'NV'},
    {name: 'New Hampshire', value: 'NH'},
    {name: 'New Jersey', value: 'NJ'},
    {name: 'New Mexico', value: 'NM'},
    {name: 'New York', value: 'NY'},
    {name: 'North Carolina', value: 'NC'},
    {name: 'North Dakota', value: 'ND'},
    {name: 'Ohio', value: 'OH'},
    {name: 'Oklahoma', value: 'OK'},
    {name: 'Oregon', value: 'OR'},
    {name: 'Pennsylvania', value: 'PA'},
    {name: 'Rhode Island', value: 'RI'},
    {name: 'South Carolina', value: 'SC'},
    {name: 'South Dakota', value: 'SD'},
    {name: 'Tennessee', value: 'TN'},
    {name: 'Texas', value: 'TX'},
    {name: 'Utah', value: 'UT'},
    {name: 'Vermont', value: 'VT'},
    {name: 'Virginia', value: 'VA'},
    {name: 'Washington', value: 'WA'},
    {name: 'West Virginia', value: 'WV'},
    {name: 'Wisconsin', value: 'WI'},
    {name: 'Wyoming', value: 'WY'},
    {name: 'Armed Forces Americas', value: 'AA'},
    {name: 'Armed Forces Europe', value: 'AE'},
    {name: 'Armed Forces Pacific', value: 'AP'}
  ];

  private stateCodes: Set<string> = new Set(this.states.map(s => s.value));

  sameAsShipping: boolean = false;

  modalOpen: boolean = false;
  modalTitle: string = '';
  modalBody: string = '';
  modalKind: 'success' | 'error' | 'warning' = 'success';

  constructor(private cartService: CartService, private router: Router, private titleService: Title, private zone: NgZone, private formBuilder: FormBuilder) {
    this.titleService.setTitle("Checkout - Elmwood Armory");
  }

  ngOnInit() {
    this.cartService.refreshCart();

    this.cartService.refreshCart().subscribe(items => {
      this.cartItems = items;
      if (this.cartItems.length < 1) {
        this.router.navigate(['/cart']);
      }
      this.cartTotal = items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
    });

    this.styleElement = document.createElement('link');
    this.styleElement.setAttribute('rel', 'stylesheet');
    this.styleElement.setAttribute('href', 'https://www.paypalobjects.com/webstatic/en_US/developer/docs/css/cardfields.css');
    document.head.appendChild(this.styleElement);

    this.scriptElement = document.createElement('script');
    let client_id: string = environment.PAYPAL_CLIENT_ID;
    this.scriptElement.setAttribute('src', `https://www.paypal.com/sdk/js?client-id=${client_id}&components=buttons,card-fields`);
    this.scriptElement.setAttribute('data-sdk-integration-source', "developer-studio");
    this.scriptElement.onload = () => {
      this.payPalSDKReady = true;
      if (this.currentCheckoutStep == 4) this.zone.onStable.pipe(take(1)).subscribe(() => this.tryInitPayPal()); //should realistically never be the case
    }
    document.head.appendChild(this.scriptElement);

    this.shippingForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', this.phoneValidator.bind(this)],
      email: ['', Validators.email],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      adminArea1: ['', [Validators.required, this.stateValidator.bind(this)]],
      adminArea2: ['', [Validators.required]],
      countryCode: [{value: 'US', disabled: true}],
      postalCode: ['', [Validators.required, this.zipValidator.bind(this)]],
    }, { validators: this.phoneOrEmailRequired.bind(this) });

    this.shippingForm.get('phoneNumber')!.valueChanges.subscribe(v => {
      if (v == null) return;

      const digits = String(v).replace(/\D/g, '').replace(/^1(\d{10})$/, '$1').slice(0, 10);

      let out = '';

      if (digits.length > 6) out = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      else if (digits.length > 3) out = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}`;
      else out = `(${digits}`;

      this.shippingForm.get('phoneNumber')!.setValue(out, { emitEvent: false });
    });

    this.billingForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      adminArea1: ['', [Validators.required, this.stateValidator.bind(this)]],
      adminArea2: ['', [Validators.required]],
      countryCode: [{value: 'US', disabled: true}],
      postalCode: ['', [Validators.required, this.zipValidator.bind(this)]],
    });
  }

  private markGroupTouched(g: FormGroup) {
    Object.values(g.controls).forEach(ctrl => {
      if (ctrl instanceof FormGroup) this.markGroupTouched(ctrl);
      else ctrl.markAsTouched();
    });
  }

  verifyCurrentAndChangeCheckoutStep(nextStep: number) {
    const group = this.currentCheckoutStep == 1 ? this.shippingForm : (this.currentCheckoutStep == 2 ? this.billingForm : null);

    switch (this.currentCheckoutStep) {
      case 1:
      case 2:
        if (this.currentCheckoutStep < nextStep && group && group.invalid) {
          this.markGroupTouched(group);
          requestAnimationFrame(() => {
            const el = document.querySelector(".ng-invalid.ng-touched") as HTMLElement | null;
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
            el?.focus();
          });
          return;
        }
        break;
      case 3:
        break;
      case 4:
        this.payPalInitialized = false;
        break;
    }

    switch (nextStep) {
      case 1:
        this.currentCheckoutStep = 1;
        break;
      case 2:
        this.currentCheckoutStep = 2;
        break;
      case 3:
        this.currentCheckoutStep = 3;
        break;
      case 4:
        this.currentCheckoutStep = 4;
        this.zone.onStable.pipe(take(1)).subscribe(() => {
          this.tryInitPayPal();
        });
        break;
    }
  }

  private stateValidator = (c: AbstractControl): ValidationErrors | null =>
    c.value && !this.stateCodes.has(c.value) ? {state: true} : null;

  private zipValidator(c: AbstractControl): ValidationErrors | null {
    const v = (c.value?? '').trim();
    return v && !/^\d{5}(-\d{4})?$/.test(v) ? { zip: true } : null;
  }

  private phoneValidator(c: AbstractControl): ValidationErrors | null {
    const v = (c.value?? '').trim();
    return v && !/^\(\d{3}\)\s\d{3}-\d{4}$/.test(v) ? { phone: true } : null;
  }

  private phoneOrEmailRequired(group: AbstractControl): ValidationErrors | null {
    const phone = group.get('phoneNumber')?.value?.trim();
    const email = group.get('email')?.value?.trim();
    return (!phone && !email) ? { phoneOrEmailRequired: true } : null;
  }

  onToggleSameAsShipping(checked: boolean) {
    this.sameAsShipping = checked;
    const shipping = this.shippingForm.getRawValue();

    if (this.sameAsShipping) {
      this.billingFieldsSnapshot = this.billingForm.getRawValue();
      this.billingForm.patchValue({
        addressLine1: shipping.addressLine1,
        addressLine2: shipping.addressLine2,
        adminArea1: shipping.adminArea1,
        adminArea2: shipping.adminArea2,
        countryCode: 'US',
        postalCode: shipping.postalCode,
        firstName: shipping.firstName,
        lastName: shipping.lastName,
      }, {emitEvent: false});
    } else if (this.billingFieldsSnapshot) {
      this.billingForm.patchValue(this.billingFieldsSnapshot, {emitEvent: false});
    }
  }

  private tryInitPayPal(retries = 20) {
    if (this.payPalInitialized) return;
    if (!this.payPalSDKReady) return;

    const btn = document.getElementById("paypal-button-container");
    const nameC = document.getElementById("card-name-field-container");
    const numC = document.getElementById("card-number-field-container");
    const expC = document.getElementById("card-expiry-field-container");
    const cvvC = document.getElementById("card-cvv-field-container");
    const submitBtn = document.getElementById("card-field-submit-button");

    if (!btn || !nameC || !numC || !expC || !cvvC || !submitBtn) {
      if (retries > 0) {
        setTimeout(() => this.tryInitPayPal(retries - 1), 50);
        return;
      }
      alert("PayPal fields could not be initialized. Please try again later.");
      return;
    }

    this.initPayPal();
    this.payPalInitialized = true;
  }

  initPayPal() {
    const self = this;

    // Render the button component
    paypal
      .Buttons({
        // Sets up the transaction when a payment button is clicked
        createOrder: createOrderCallback,
        onApprove: onApproveCallback,
        onError: function (error: string) {
          self.zone.run(() => {
            self.openModal('error', 'Checkout error', error ?? 'An unexpected error occurred. Please try again. If this issue persists, please contact us for assistance.');
          });
        },

        style: {
          shape: "rect",
          layout: "vertical",
          color: "gold",
          label: "paypal",
        },
        message: {
          amount: this.cartTotal + (this.cartItems.length * 11),
        },
      })
      .render("#paypal-button-container");

    async function createOrderCallback() {
      // resultMessage("");
      try {
        const response = await fetch("/api/paypal/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          // use the "body" param to optionally pass additional order information
          // like product ids and quantities
          body: JSON.stringify({
            values: {
              shipping: self.getShippingModel(),
              billing: self.getBillingModel()
            }
          }),
        });

        const { jsonResponse: orderData } = await response.json();

        if (orderData.id) {
          return orderData.id;
        } else {
          const errorDetail = orderData?.details?.[0];
          const errorMessage = errorDetail
            ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
            : JSON.stringify(orderData);

          // throw new Error(errorMessage);
          throw new Error('Order creation failed');
        }
      } catch (error) {
        self.zone.run(() => {
          self.openModal('error', 'Checkout error', 'Could not initiate PayPal checkout. Please try again.');
        });
        throw error;
        // console.error(error);
        // resultMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
      }
    }

    async function onApproveCallback(data: {orderID: string}, actions: any) {
      try {
        const response = await fetch(`/api/paypal/capture`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            orderID: data.orderID,
          }),
        });

        const {jsonResponse: orderData} = await response.json();
        // Three cases to handle:
        //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        //   (2) Other non-recoverable errors -> Show a failure message
        //   (3) Successful transaction -> Show confirmation or thank you message

        const transaction =
          orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
          orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
        const errorDetail = orderData?.details?.[0];

        if (errorDetail || !transaction || transaction.status === "DECLINED") {
          // (2) Other non-recoverable errors -> Show a failure message
          // let errorMessage;
          // if (transaction) {
          //   errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
          // } else if (errorDetail) {
          //   errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
          // } else {
          //   errorMessage = JSON.stringify(orderData);
          // }
          // throw new Error(errorMessage);

          if (errorDetail?.issue === 'INSTRUMENT_DECLINED' && actions?.restart) {
            return actions.restart();
          }

          const msg = explainPayPalError(orderData);
          self.zone.run(() => {
            self.openModal('error', 'Payment unsuccessful', msg);
          });
          return;
        } else {
          // (3) Successful transaction -> Show confirmation, or thank you message
          // Or go to another URL: actions.redirect('thank_you.html');
          // resultMessage(
          //   `Transaction ${transaction.status}: ${transaction.id}<br><br>See console for all available details`
          // );
          // console.log(
          //   "Capture result",
          //   orderData,
          //   JSON.stringify(orderData, null, 2)
          // );

          const persistRes = await fetch('/api/orders/store', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(buildOrderPayload(transaction))
          });

          if (!persistRes.ok) {
            self.zone.run(() => {
              self.openModal('warning', 'Order received!', `Your payment was captured successfully. Your order number is ${orderData.id}.\n\nHowever, your order was not recorded correctly. Please contact us with transaction ID ${transaction.id}.`);
            });
            return;
          }

          self.cartService.clearCart().subscribe({
            next: () => showSuccessModal(<string>orderData.id),
            error: () => showSuccessModal(<string>orderData.id)
          });
        }
      } catch (error) {
        // console.error(error);
        // resultMessage(
        //   `Sorry, your transaction could not be processed...<br><br>${error}`
        // );

        self.zone.run(() => {
          self.openModal('error', 'Payment unsuccessful', 'Your payment was not processed successfully. Please try again.');
        });
      }
    }

    function showSuccessModal(orderID: string) {
      self.zone.run(() => {
        self.openModal('success', 'Order received!', `Your payment was captured successfully. Your order number is ${orderID}.\n\nYou will be redirect to the homepage shortly...`);

        setTimeout(() => {
          self.router.navigate(['/home']);
        }, 5000);
      });
    }

    // Render each field after checking for eligibility
    // @ts-ignore
    const cardField = window.paypal.CardFields({
      createOrder: createOrderCallback,
      onApprove: onApproveCallback,
      style: {
        input: {
          "font-size": "16px",
          "font-family": "courier, monospace",
          "font-weight": "lighter",
          color: "#ccc",
        },
        ".invalid": { color: "#d9534f" },
      },
    });

    if (cardField.isEligible()) {
      const nameField = cardField.NameField({
        style: { input: { color: "#727557" }, ".invalid": { color: "#d9534f" } },
      });
      nameField.render("#card-name-field-container");

      const numberField = cardField.NumberField({
        style: { input: { color: "#727557" }, ".invalid": { color: "#d9534f" } },
      });
      numberField.render("#card-number-field-container");

      const cvvField = cardField.CVVField({
        style: { input: { color: "#727557" }, ".invalid": { color: "#d9534f" } },
      });
      cvvField.render("#card-cvv-field-container");

      const expiryField = cardField.ExpiryField({
        style: { input: { color: "#727557" }, ".invalid": { color: "#d9534f" } },
      });
      expiryField.render("#card-expiry-field-container");

      // Add click listener to submit button and call the submit function on the CardField component
      document
        .getElementById("card-field-submit-button")!
        .addEventListener("click", () => {
          if (this.billingForm.invalid) {
            alert("Please enter your billing address.");
            this.zone.run(() => {
              this.billingForm.markAsTouched();
              this.verifyCurrentAndChangeCheckoutStep(2);
            });
            return;
          }

          const b = this.getBillingModel();
          cardField
            .submit({
              // From your billing address fields
              billingAddress: {
                addressLine1: b.addressLine1,
                addressLine2: b.addressLine2 || '',
                adminArea1: b.adminArea1,
                adminArea2: b.adminArea2,
                countryCode: b.countryCode,
                postalCode: b.postalCode,
              }
            })
            .then(() => {
              // submit successful
            });
        });
    }

    // Example function to show a result to the user. Your site's UI library can be used instead.
    function resultMessage(message: string) {
      const container = document.querySelector("#result-message");
      container!.innerHTML = message;
    }

    function explainPayPalError(orderData: any): string {
      const d0 = orderData?.details?.[0];
      const issue = d0?.issue;
      const description = d0?.description || 'The payment could not be completed.';
      const debug = orderData?.debug_id ? ` (Ref: ${orderData.debug_id})` : '';

      switch (issue) {
        case 'INSTRUMENT_DECLINED':
          return 'Your card was declined by the issuer. Try a different card or payment method.';
        case 'PAYER_ACTION_REQUIRED':
          return 'Additional action is required by your bank. Please complete the authentication and try again.';
        case 'INVALID_PAYMENT_METHOD':
          return 'Invalid or unsupported payment method. Try another one.';
        case 'TRANSACTION_REFUSED':
          return 'The transaction was refused by the processor. Please try again or use a different card.';
        default:
          return `${description}${debug}`;
      }
    }

    function buildOrderPayload(capture: any): Order{
      return {
        orderId: capture.id,
        status: capture.status,
        cartItems: self.cartItems,
        totals: {
          subtotal: self.cartTotal,
          shipping: self.cartItems.length * 11,
          taxes: 0,
          total: self.cartTotal + (self.cartItems.length * 11)
        },
        shipping: self.getShippingModel(),
        billing: self.getBillingModel(),
        email: self.shippingForm.get('email')?.getRawValue() ?? null,
        phone: self.shippingForm.get('phoneNumber')?.getRawValue() ?? null,
        apiRef: {
          shipping: {},
          taxes: {},
          payment: capture
        },
        orderDate: new Date()
      };
    }
  }

  private openModal(kind: 'success' | 'error' | 'warning', title: string, body: string): void {
    this.modalOpen = true;
    this.modalKind = kind;
    this.modalTitle = title;
    this.modalBody = body;
  }

  closeModal() { this.modalOpen = false; }

  goHome() {
    this.router.navigate(['/home']).catch(() => {});
  }

  ngOnDestroy() {
    document.head.removeChild(this.styleElement!);
    document.head.removeChild(this.scriptElement!);
    this.payPalSDKReady = false;
    this.payPalInitialized = false;
  }
}
