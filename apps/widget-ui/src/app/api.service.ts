import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";
import {BaseWidget} from "@tedwin007/widgets";
import {ExistingWidgetMock} from "./app.config";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  widgets$ = new BehaviorSubject<BaseWidget>(this.getNewWidgetTemplate())
  mockWidget: BaseWidget = ExistingWidgetMock

  constructor() {
    this.fetchWidgets();
  }

  fetchWidgets(): Observable<BaseWidget> {
    this.widgets$.next(this.mockWidget)
    return of(this.mockWidget)
  }

  getValue() {
    return this.widgets$.getValue();
  }

  getNewWidgetTemplate(): BaseWidget {
    return {
      widgetProps: {},
      config: {}
    }
  }
}
