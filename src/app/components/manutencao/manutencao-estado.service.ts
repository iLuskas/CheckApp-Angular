import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class ManutencaoEstadoService {
  constructor() {}
  public isManutentionDone: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public isAllManutentionDone: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
}
