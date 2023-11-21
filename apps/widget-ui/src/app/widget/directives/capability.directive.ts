import {Directive, inject, Input} from '@angular/core';
import {BaseWidget} from "@tedwin007/widgets";
import {WidgetService} from "../widget.service";
import {Capabilities} from "../models/interfaces";

@Directive({
  selector: '[widgetUiCapability]',
  standalone: true


})
export class CapabilityDirective<T> {
  private widgetService: WidgetService = inject(WidgetService);
  private _widgetUi?: BaseWidget<T>;
  private _capabilities?: Capabilities

  @Input() set widgetUi(widget: BaseWidget<T>) {
    this._widgetUi = widget
    this.executeCapabilities();

  }

  @Input() set capabilities(capabilities: Capabilities) {
    this._capabilities = capabilities
    this.executeCapabilities();
  }

  private executeCapabilities(): void {
    if (this._capabilities && this._widgetUi) {
      Object.entries(this._capabilities).forEach(([name, callback]: [string, any]) =>
        setTimeout(() => callback?.(this._widgetUi!), 200)
      )
    }
  }
}
