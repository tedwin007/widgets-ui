import {inject, Injectable} from '@angular/core';
import {BaseWidget, FromJsonResponse, ToJsonResult, WidgetManager, WidgetSchema} from "@tedwin007/widgets";
import {ApiService} from "../api.service";
import {BehaviorSubject, Observable, of, take, tap} from "rxjs";
import {disableContentEditable, getNewWidgetTemplate, getTypeOf, toContentEditable} from "./utils";
import {CreateWidgetSchema, EditWidgetSchema} from "@tedwin007/widgets/src/lib/schema/constants/schemas-def.const";
import {Capabilities, WidgetProps} from "./models/interfaces";


type HiddenProps = Pick<BaseWidget, 'id' | 'version'>;



@Injectable({providedIn: 'root'})
export class WidgetService {
  static readonly WIDGETS_CONTAINER_SELECTOR: string = '#widgets-wrapper'
  private widgetManger: WidgetManager = new WidgetManager(console)
  private apiService: ApiService = inject(ApiService);
  private widgets$: BehaviorSubject<BaseWidget> = new BehaviorSubject<BaseWidget>(getNewWidgetTemplate())

  get widgetCapabilities(): Capabilities {
    return {
      canEdit: (widget: BaseWidget) => {
        if (widget.config['canEdit']) toContentEditable()
        else disableContentEditable()
      }
    }
  }
  constructor() {
    // simulate fetching widget's data from an api
    this.apiService.fetchWidgets().pipe(
        take(1),
        tap((data) => this.widgets$.next(data))
    ).subscribe();
  }

  getValue(): BaseWidget {
    return this.widgets$.getValue();
  }

  getWidgets$(): Observable<BaseWidget> {
    return this.widgets$.asObservable()
  }

  setValue(widget: BaseWidget): void {
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

  /**
   * ## Constructing Custom Schemas
   * @description When creating a new widget, defining a precise data structure is crucial.
   * This includes specifying mandatory properties, their types, and the widget's capabilities (config).
   * Consistency is essential throughout the widget's lifecycle.
   * For instance, we aim to avoid changes that could lead to breaking changes.
   * In such cases, creating a new widget version is preferable.
   * This flexibility is enabled by the "widgets" library's support for custom schemas (WidgetSchema.custom).
   * Usage scenarios:
   * - To create an entirely new widget, use WidgetSchema.New
   * - To modify an existing widget, use WidgetSchema.Existing
   * - To validate a particular widget, use WidgetSchema.custom
   *
   * @param props
   * @param isNewWidget
   */
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

}
