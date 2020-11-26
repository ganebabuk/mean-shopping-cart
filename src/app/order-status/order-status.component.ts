import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit {

  orderStatusForm: FormGroup;
  public buttonDisable = false;
  public orderList;
  public panelOpenState = false;
  public currentOpenedItemId: number;
  public hidden = true;

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private http: HttpClient,
    private apiService: ApiService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.titleService.setTitle('Order Status');
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.orderStatusForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern(emailPattern)]],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]+')]]
    });
  }


  public handleOpened(i): void {
    this.currentOpenedItemId = i;
  }

  public onSubmit(): void {
    if (this.orderStatusForm.valid) {
      this.buttonDisable = true;
      this.apiService.postApi('api/order-status', this.orderStatusForm.value).subscribe(response => {
        this.buttonDisable = false;
        this.orderList = response;
        this.hidden = false;
      },
      error => {
        this.buttonDisable = false;
        this.hidden = true;
        this.snackBar.open('Order not found. Invalid email or mobile number.', 'Retry!', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['red-snackbar'],
        });
      });
    }
  }

}
