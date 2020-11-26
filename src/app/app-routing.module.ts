import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { from } from 'rxjs';

const routes: Routes = [
  { path: '', component: DeviceListComponent },
  { path: 'devices', component: DeviceListComponent },
  { path: 'device-details', component: DeviceDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-status', component: OrderStatusComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
