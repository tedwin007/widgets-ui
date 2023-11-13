import {Injectable} from '@angular/core';
import {BaseWidget, FromJsonResponse, WidgetManager, WidgetSchema} from "@tedwin007/widgets";


@Injectable()
export class WidgetService {
  static readonly WIDGETS_CONTAINER_SELECTOR: string = '#widgets-wrapper'
  private widgetManger: WidgetManager = new WidgetManager(console)

  instantiate(rawWidget: BaseWidget): FromJsonResponse | void {
    const widgetSchema = <any>(rawWidget.id ? WidgetSchema.Existing : WidgetSchema.New)
    return this.widgetManger.fromJson(rawWidget, widgetSchema)
  }
}
