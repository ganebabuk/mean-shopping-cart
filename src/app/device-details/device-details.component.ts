import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit, OnDestroy {
  public deviceDetails$: Observable<any>;
  public isLoad = false;
  public qty = 1;
  public buttonDisable = false;
  private isRefresh: boolean;
  private routeSubscription: Subscription;
  private componentSubscription: Subscription;
  @ViewChild('qty') input;

  constructor(
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private route: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private ss: StatusService,
    ) {
    this.isRefresh = this.route.navigated;
    this.componentSubscription = this.ss.getMessage().subscribe(response => {
      this.getDeviceInfo();
    });
    this.routeSubscription = this.route.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      if (this.isRefresh) {
        this.getDeviceInfo();
      }
    });
  }

  ngOnInit(): void {
  }

  private getDeviceInfo(): void {
    this.activatedRoute.queryParams.subscribe(res => {
      this.deviceDetails$ = this.apiService.getApi('api/device-details/' + res.skuid).pipe(
        map((response) => {
            return response;
          }
        )
      );
    });
    this.deviceDetails$.subscribe(response => {
      if (response) {
        this.isLoad = true;
        this.titleService.setTitle(response.devicename);
      } else {
        this.route.navigate(['/devices']);
      }
    },
    error => {
      this.snackBar.open('Oops..API Error', 'Retry', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['red-snackbar'],
      });
      this.route.navigate(['/devices']);
    });
  }

  public addToCart(deviceDetail): void {
    this.buttonDisable = true;
    deviceDetail.qty = Number(this.input.nativeElement.value);
    deviceDetail.deviceofferprice = Number(deviceDetail.deviceofferprice);
    deviceDetail.deviceprice = Number(deviceDetail.deviceprice);
    this.apiService.postApi('api/device-details', deviceDetail).subscribe((res) => {
      this.route.navigate(['/checkout']);
    },
    error => {
      this.snackBar.open('Oops..API Error', 'Retry', {
        duration: 2000,
      });
      this.route.navigate(['/devices']);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.componentSubscription.unsubscribe();
  }

}
