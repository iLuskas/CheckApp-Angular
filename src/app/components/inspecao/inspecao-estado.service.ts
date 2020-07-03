import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InspecaoEstadoService {

constructor() { }
  public isInspetionDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAllInspetionDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
