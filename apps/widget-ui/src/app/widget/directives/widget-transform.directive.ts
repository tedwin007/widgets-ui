import {Directive, Input} from '@angular/core';
import {BaseWidget} from "@tedwin007/widgets";
import {WidgetTransform} from "../models/interfaces";

export type WidgetPropKey<T> = Partial<keyof BaseWidget<T>['widgetProps']>

@Directive({
  selector: '[widgetUiTransform]',
  standalone: true,
})
export class WidgetTransformDirective<T = any> {
  private _widgetUi!: BaseWidget<T>

  get widgetUi(): BaseWidget<T> {
    return this._widgetUi;
  }

  @Input() set widgetUi(value: BaseWidget<T>) {
    this._widgetUi = value;
    this.executeTransformers();

  }

  private _transformers?: WidgetTransform<T>;

  @Input() set transform(value: WidgetTransform<T>) {
    this._transformers = value;
    this.executeTransformers();
  }

  private executeTransformers() {
    if (this._transformers && this._widgetUi) {
      console.log(this._transformers);
      for (const prop in this._transformers) {
        console.log('  1', this._widgetUi.widgetProps[prop as WidgetPropKey<T>])
        this._widgetUi.widgetProps[prop as WidgetPropKey<T>] = (this._transformers?.[prop] && typeof this._transformers[prop] === "function") ? this._transformers[prop]?.(this.widgetUi) : this.transform[prop]
      }
    }
  }


}
