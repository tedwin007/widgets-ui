import {inject, Injectable} from '@angular/core';
import {BaseWidget, FromJsonResponse, ToJsonResult, WidgetManager, WidgetSchema} from "@tedwin007/widgets";
import {ApiService} from "../api.service";
import {BehaviorSubject, Observable, of, take, tap} from "rxjs";
import {toContentEditable, getNewWidgetTemplate, getTypeOf, disableContentEditable} from "./utils";
import {CreateWidgetSchema, EditWidgetSchema} from "@tedwin007/widgets/src/lib/schema/constants/schemas-def.const";
import {WidgetProps} from "./models/interfaces";


type HiddenProps = Pick<BaseWidget, 'id' | 'version'>;

export interface Capabilities {
  canEdit: (widget: BaseWidget) => void
}

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


  setValue(widget: BaseWidget<any, any>): void {
    return this.widgets$.next(widget)
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
  saveWidget({widgetProps, config}: BaseWidget, hiddenProps?: HiddenProps): Observable<ToJsonResult | undefined> {
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
    return {
      ...schema,
      properties: {
        ...schema.properties,
        widgetProps: {...this.toPropsSchema(props)}
      }
    }
  }

  private toPropsSchema(props: WidgetProps): WidgetProps {
    return Object.keys(props).reduce((prev, current: string) => {
      const value = {type: getTypeOf(props[current])};
      return {
        ...prev,
        [current]: this.getSchemaByType(value)
      }
    }, {});
  }

  private getSchemaByType(value: { type: string }) {
    const type = value.type === 'text' ? 'string' : value.type;
    const isObjectType = type === 'object';
    return {
      type,
      ...(isObjectType ? {additionalProperties: isObjectType} : {}),
      // TBD - nested props
      ...(isObjectType ? {properties: {}} : {}),
    }
  }

  private toWidgetProps(widgetProps: any): WidgetProps {
    return Object.keys(widgetProps || {}).reduce((previousValue, currentValue: string): WidgetProps => {
      return {
        ...previousValue,
        [currentValue]: widgetProps[currentValue] === 'text' ? 'string' : widgetProps[currentValue]
      }
    }, {});
  }

  get widgetCapabilities(): Capabilities {
    return {
      canEdit: (widget: BaseWidget) => {
        if (widget.config['canEdit']) toContentEditable()
        else disableContentEditable()
      }
    }
  }

}
