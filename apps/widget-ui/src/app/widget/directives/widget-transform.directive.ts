import {Directive, Input} from '@angular/core';
import {BaseWidget} from "@tedwin007/widgets";
import {WidgetTransform} from "../models/interfaces";

export type WidgetPropKey<T> = Partial<keyof BaseWidget<T>['widgetProps']>

@Directive({
  selector: '[widgetUiTransform]',
  standalone: true,
})
export class WidgetTransformDirective<T = any> {

  @Input() set transform(value: WidgetTransform<T>) {
    if (this.widgetUi)
      for (const prop in value) {
        this.widgetUi.widgetProps[prop as WidgetPropKey<T>] = ((value[prop] && typeof value[prop] === "function") ? value[prop]?.() : value[prop])
      }
  }

  @Input() widgetUi!: BaseWidget<T>

}
