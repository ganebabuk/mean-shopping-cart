import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ApiService } from './services/api.service';
import { StatusService } from './services/status.service';


interface SessionInfo {
  cartId: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'shopping-cart';
  private sessionSubscription: Subscription;

  constructor(
    private ss: StatusService,
    private titleService: Title,
    private route: Router,
    private apiService: ApiService
    ) {
    this.sessionSubscription = this.apiService.getApi('api/session').subscribe((response: SessionInfo) => {
        localStorage.setItem('cartId', response.cartId);
        this.ss.setMessage('session api triggered.');
    });
    this.ss.lsStatus.subscribe(res => {
      this.getSession();
    });
    window.addEventListener('storage', (e) => {
      if (e.key === 'cartId') {
        if (!e.newValue) {
          this.apiService.getApi('api/session').subscribe((response: SessionInfo) => {
            localStorage.setItem('cartId', response.cartId);
          });
        }
      }
    });
  }

  private getSession(): void {
    this.apiService.getApi('api/session').subscribe((response: SessionInfo) => {
      localStorage.setItem('cartId', response.cartId);
      this.ss.lsUpdateStatus.next('cartId added in ls using subject');
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.sessionSubscription.unsubscribe();
  }

  public showCart(): void {
    this.route.navigate(['/checkout']);
  }
}
