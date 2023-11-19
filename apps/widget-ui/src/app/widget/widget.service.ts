import {inject, Injectable} from '@angular/core';
import {BaseWidget, FromJsonResponse, WidgetManager, WidgetSchema} from "@tedwin007/widgets";
import {ApiService} from "../api.service";
import {BehaviorSubject, Observable, of, take, tap} from "rxjs";
import {getNewWidgetTemplate, getTypeOf} from "./utils";
import {ToJsonResult} from "@tedwin007/widgets/src/lib/widget/interfaces/widget.interface";
import {CreateWidgetSchema, EditWidgetSchema} from "@tedwin007/widgets/src/lib/schema/constants/schemas-def.const";
import {WidgetProps} from "./models/interfaces";


@Injectable({providedIn: 'root'})
export class WidgetService {
  static readonly WIDGETS_CONTAINER_SELECTOR: string = '#widgets-wrapper'
  private widgetManger: WidgetManager = new WidgetManager(console)
  private apiService: ApiService = inject(ApiService);
  widgets$: BehaviorSubject<BaseWidget> = new BehaviorSubject<BaseWidget>(getNewWidgetTemplate())

  constructor() {
    this.apiService.fetchWidgets().pipe(
        take(1),
        tap((data) => this.widgets$.next(data))
    ).subscribe();
  }

  getValue(): BaseWidget<any, any> {
    return this.widgets$.getValue();
  }

  instantiate(rawWidget: BaseWidget): FromJsonResponse | void {
    const widgetSchema = <any>(rawWidget.id ? WidgetSchema.Existing : WidgetSchema.New)
    return this.widgetManger.fromJson(rawWidget, widgetSchema)
  }

  /**
   * ## Save Widget
   * @param widgetProps
   * @param id
   * @param config
   * @param hiddenProps
   */
  saveWidget({widgetProps, config}: BaseWidget<any, any>, hiddenProps?: {
    id: string,
    version: string
  }): Observable<ToJsonResult | undefined> {
    const {id, version} = hiddenProps || {};
    const props: WidgetProps = this.toWidgetProps(widgetProps)
    const customSchema = this.buildCustomSchema(props, !id);
    const widget: BaseWidget = {...(id ? {version, id} : {}), config, widgetProps: {...props}};

    const rawWidget: BaseWidget | undefined = this.widgetManger
        .fromJson(widget, WidgetSchema.custom, customSchema)
        .getInstance()
    return rawWidget ? this.apiService.saveWidget(rawWidget) : of(undefined)
  }

  buildCustomSchema(props: BaseWidget["widgetProps"], isNewWidget: boolean) {
    const schema = isNewWidget ? CreateWidgetSchema : EditWidgetSchema
    const result = {
      ...schema,
      properties: {
        ...schema.properties,
        widgetProps: {...this.toPropsSchema(props)}
      }
    };
    console.log("** Generated Schema: ** ", result)
    return result
  }

  private toPropsSchema(props: WidgetProps): WidgetProps {
    return Object.keys(props).reduce((prev, current) => {
      const value = {type: getTypeOf(props[current])};
      return {
        ...prev,
        [current]: value.type === 'text' ? 'string' : value
      }
    }, {});
  }

  private toWidgetProps(widgetProps: any): WidgetProps {
    return Object.keys(widgetProps || {}).reduce((previousValue, currentValue: string): WidgetProps => {
      console.log(widgetProps[currentValue])
      return {...previousValue, [currentValue]: widgetProps[currentValue] === 'text' ? 'string' : widgetProps[currentValue]}
    }, {});
  }
}
