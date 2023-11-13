import {Directive, inject, Input, Type} from '@angular/core';
import {BaseWidget, FromJsonResponse, UIWidget} from "@tedwin007/widgets";
import {WidgetService} from "../widget.service";
import {renderByComponent} from "../utils";
import {WidgetTransformDirective} from "./widget-transform.directive";
import {RenderParams} from "../models/interfaces";

@Directive({
  selector: '[widgetUi]',
  standalone: true,
  hostDirectives: [{
    directive: WidgetTransformDirective,
    inputs: ['transform:transform', 'widgetUi:widgetUi']
  }]

})
export class WidgetDirective<T> {
  private widgetService: WidgetService = inject(WidgetService);
  private fromJson!: FromJsonResponse;
  private renderBy = renderByComponent()
  protected widgetUI?: UIWidget
  protected _rawWidget!: BaseWidget<T>


  @Input('widgetUi') set rawWidget(value: BaseWidget) {
    this._rawWidget = value;
    console.log('_rawWidget', value)
    this.fromJson = this.widgetService.instantiate(this._rawWidget)!
    console.log('fromJson', this.fromJson )
    this.widgetUI = this.fromJson.getInstance();
    console.log('getInstance', this.fromJson.getInstance() )

  }

  @Input() set type(component: Type<any>) {
    setTimeout(() => this.renderWidgets(component))
  }

  private getAttachRenderParams(component: Type<any>): RenderParams | null {
    return {
      element: document.querySelector(WidgetService.WIDGETS_CONTAINER_SELECTOR)!,
      widget: this.fromJson.getInstance(),
      component: component,
    };
  }

  private renderWidgets(component: Type<any>): void {
    const widgetsWrapper: HTMLElement | null = document.querySelector('#widgets-wrapper')
    const attachRenderParams = this.getAttachRenderParams(component);
    if (attachRenderParams) {
      this.fromJson.attachRender(this, this.renderBy.bind(this, attachRenderParams)).render(widgetsWrapper!);
    }
  }
}
