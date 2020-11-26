import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  public lsStatus = new Subject<string>();
  public lsUpdateStatus = new Subject<string>();
  private status = new Subject<boolean>();

  constructor() { }

  setMessage(status: any): void {
    this.status.next(status);
  }

  getMessage(): Observable<any> {
    return this.status.asObservable();
  }
}
