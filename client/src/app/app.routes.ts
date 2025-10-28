import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {GalleryComponent} from './components/gallery/gallery.component';
import {ShopComponent} from './components/shop/shop.component';
import {AboutComponent} from './components/about/about.component';
import {TermsComponent} from './components/terms/terms.component';
import {PoliciesComponent} from './components/policies/policies.component';
import {ProductComponent} from './components/product/product.component';
import {CartComponent} from './components/cart/cart.component';
import {CheckoutComponent} from './components/checkout/checkout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'about', component: AboutComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'policies', component: PoliciesComponent },
  { path: 'product/:path', component: ProductComponent},
  { path: 'cart', component: CartComponent},
  { path: 'checkout', component: CheckoutComponent },

  { path: '**', redirectTo: '/home' }
];
