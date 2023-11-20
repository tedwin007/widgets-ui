import {Directive, inject, Input} from '@angular/core';
import {BaseWidget} from "@tedwin007/widgets";
import {Capabilities, WidgetService} from "../widget.service";

@Directive({
  selector: '[widgetUiCapability]',
  standalone: true


})
export class CapabilityDirective<T> {
  private widgetService: WidgetService = inject(WidgetService);
  @Input() widgetUi!: BaseWidget<T>

  @Input() set capabilities(names: (keyof Capabilities)[]) {
    names.forEach((item: keyof Capabilities) =>
      setTimeout(() => this.widgetService.widgetCapabilities?.[item](this.widgetUi), 200)
    )
  }
}
