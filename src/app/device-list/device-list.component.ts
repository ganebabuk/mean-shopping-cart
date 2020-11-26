import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatusService } from '../services/status.service';
import { ApiService } from '../services/api.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, Observable, of } from 'rxjs';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit, OnDestroy {
  public devicelist;
  private routeSubscription: Subscription;
  private componentSubscription: Subscription;
  private isRefresh: boolean;
  constructor(
    private ss: StatusService,
    private titleService: Title,
    private route: Router,
    private http: HttpClient,
    private apiService: ApiService,
    private snackBar: MatSnackBar) {
    this.titleService.setTitle('Welcome to Shop Online - Device List');
    this.isRefresh = this.route.navigated;
    this.componentSubscription = this.ss.getMessage().subscribe(response => {
      this.getDevices();
    });
    this.routeSubscription = this.route.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      if (this.isRefresh) {
        this.getDevices();
      }
    });
  }

  public deviceInfo(skuId: string): void {
    this.route.navigate(['/device-details'], { queryParams: { skuid: skuId } });
  }

  ngOnInit(): void {
  }

  private getDevices(): void {
    this.apiService.getApi('api/devices').subscribe(response => {
      this.devicelist = response;
    },
    error => {
      this.snackBar.open('Oops..API Error', 'Retry', {
        duration: 2000,
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.componentSubscription.unsubscribe();
  }

}
