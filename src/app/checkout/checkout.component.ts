import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusService } from '../services/status.service';
import { Subscription, Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';

interface CartListArray {
  data: {
  currency: string;
  deviceimage: string;
  devicename: string;
  deviceofferprice: number;
  deviceprice: number;
  price: number;
  qty: number;
  skuid: string;
  _id: string;
  }[];
}

interface OrderObj {
  message: string;
  orderId: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, OnDestroy {

  userAddressForm: FormGroup;
  private orderId: string;
  public hidden = 'hidden';
  public carts;
  public deviceList;
  public states = [
                    {text: 'Alabama', code: 'AL'},
                    {text: 'Alaska', code: 'AK'},
                    {text: 'American Samoa', code: 'AS'},
                    {text: 'Arizona', code: 'AZ'},
                    {text: 'Arkansas', code: 'AR'},
                    {text: 'California', code: 'CA'},
                    {text: 'Colorado', code: 'CO'},
                    {text: 'Connecticut', code: 'CT'},
                    {text: 'Delaware', code: 'DE'},
                    {text: 'District Of Columbia', code: 'DC'},
                    {text: 'Federated States Of Micronesia', code: 'FM'},
                    {text: 'Florida', code: 'FL'},
                    {text: 'Georgia', code: 'GA'},
                    {text: 'Guam Gu', code: 'GU'},
                    {text: 'Hawaii', code: 'HI'},
                    {text: 'Idaho', code: 'ID'},
                    {text: 'Illinois', code: 'IL'},
                    {text: 'Indiana', code: 'IN'},
                    {text: 'Iowa', code: 'IA'},
                    {text: 'Kansas', code: 'KS'},
                    {text: 'Kentucky', code: 'KY'},
                    {text: 'Louisiana', code: 'LA'},
                    {text: 'Maine', code: 'ME'},
                    {text: 'Marshall Islands', code: 'MH'},
                    {text: 'Maryland', code: 'MD'},
                    {text: 'Massachusetts', code: 'MA'},
                    {text: 'Michigan', code: 'MI'},
                    {text: 'Minnesota', code: 'MN'},
                    {text: 'Mississippi', code: 'MS'},
                    {text: 'Missouri', code: 'MO'},
                    {text: 'Montana', code: 'MT'},
                    {text: 'Nebraska', code: 'NE'},
                    {text: 'Nevada', code: 'NV'},
                    {text: 'New Hampshire', code: 'NH'},
                    {text: 'New Jersey', code: 'NJ'},
                    {text: 'New Mexico', code: 'NM'},
                    {text: 'New York', code: 'NY'},
                    {text: 'North Carolina', code: 'NC'},
                    {text: 'North Dakota', code: 'ND'},
                    {text: 'Northern Mariana Islands', code: 'MP'},
                    {text: 'Ohio', code: 'OH'},
                    {text: 'Oklahoma', code: 'OK'},
                    {text: 'Oregon', code: 'OR'},
                    {text: 'Palau', code: 'PW'},
                    {text: 'Pennsylvania', code: 'PA'},
                    {text: 'Puerto Rico', code: 'PR'},
                    {text: 'Rhode Island', code: 'RI'},
                    {text: 'South Carolina', code: 'SC'},
                    {text: 'South Dakota', code: 'SD'},
                    {text: 'Tennessee', code: 'TN'},
                    {text: 'Texas', code: 'TX'},
                    {text: 'Utah', code: 'UT'},
                    {text: 'Vermont', code: 'VT'},
                    {text: 'Virgin Islands', code: 'VI'},
                    {text: 'Virginia', code: 'VA'},
                    {text: 'Washington', code: 'WA'},
                    {text: 'West Virginia', code: 'WV'},
                    {text: 'Wisconsin', code: 'WI'},
                    {text: 'Wyoming', code: 'WY'}
                  ];
  public buttonDisable = false;
  public totalprice = 0;
  public currency = '';
  public isLoad = true;
  private routeSubscription: Subscription;
  private componentSubscription: Subscription;
  private isRefresh: boolean;

  constructor(
    private ss: StatusService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private titleService: Title,
    public dialog: MatDialog,
    private route: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar) {
    this.isRefresh = this.route.navigated;
    this.componentSubscription = this.ss.getMessage().subscribe(response => {
      this.getCartInfo();
    });
    this.routeSubscription = this.route.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      if (this.isRefresh) {
        this.getCartInfo();
      }
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Checkout');
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.userAddressForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20), Validators.pattern('[^ ][a-zA-Z ]+[^ ]')]],
      lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20), Validators.pattern('[^ ][a-zA-Z ]+[^ ]')]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50), Validators.pattern('[^ ][A-Za-z 0-9_@./#:&+-,\-]+[^ ]')]],
      city: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20), Validators.pattern('[^ ][a-zA-Z ]+[^ ]')]],
      state: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern('[^ ][a-zA-Z ]+[^ ]')]],
      zipcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern(emailPattern)]],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]+')]]
    });
  }

  private getCartInfo(): void {
    this.apiService.getApi('api/carts').subscribe((response: CartListArray) => {
      this.carts = response.data;
      this.carts.forEach((cart) => {
        cart.price = cart.deviceofferprice > 0 ? cart.deviceofferprice * cart.qty : cart.deviceprice * cart.qty;
        this.totalprice += cart.price;
        this.currency = cart.currency;
      });
      this.isLoad = false;
      this.hidden = '';
    },
    error => {
      this.hidden = 'hidden';
      this.isLoad = false;
      this.snackBar.open('Your cart is empty.', 'Sorry!', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['red-snackbar'],
      });
    });
  }

  public onSubmit() {
    if (this.userAddressForm.valid) {
      this.buttonDisable = true;
      this.apiService.postApi('api/checkout', this.userAddressForm.value).subscribe((response: OrderObj) => {
        localStorage.removeItem('cartId');
        this.orderId = response.orderId;
        this.ss.lsStatus.next('ls cartdId deleted.');
      },
      error => {
        this.buttonDisable = false;;
        this.snackBar.open('Oops! Error.', 'Retry!', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['red-snackbar'],
        });
      });
    }
    this.ss.lsUpdateStatus.subscribe(res => {
      this.openDialog();
    });
  }

  public deleteItem(skuid) {
    this.apiService.deleteApi('api/carts/' + skuid).subscribe(response => {
      this.totalprice = 0;
      this.getCartInfo();
    },
    error => {
      this.hidden = 'hidden';
      this.snackBar.open('Your cart is empty.', 'Sorry!', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['red-snackbar'],
      });
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentForConfirmation, {
      data: {orderId: this.orderId}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.route.navigate(['/devices']);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.componentSubscription.unsubscribe();
  }

}

@Component({
  selector: 'dialog-content-for-confirmation',
  templateUrl: 'dialog-content-for-confirmation.html',
})
export class DialogContentForConfirmation implements OnInit {

  public orderId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.orderId = this.data.orderId;
  }

}
