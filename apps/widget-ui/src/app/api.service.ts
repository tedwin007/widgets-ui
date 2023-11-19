import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {BaseWidget} from "@tedwin007/widgets";
import {ExistingWidgetMock} from "./app.config";
import {ToJsonResult} from "@tedwin007/widgets/src/lib/widget/interfaces/widget.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  fetchWidgets(): Observable<BaseWidget> {
    return of(ExistingWidgetMock)
  }


  saveWidget(rawWidget: BaseWidget): Observable<ToJsonResult| undefined> {
    return of(rawWidget['toJson']?.());
  }
}
