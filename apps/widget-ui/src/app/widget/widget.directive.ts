import {ApplicationRef, ComponentRef, createComponent, Directive, inject, OnInit, Renderer2, Type} from '@angular/core';
import {BaseWidget, UIWidget, WidgetManager, WidgetSchema, WidgetStatus} from "@tedwin007/widgets";

@Directive({
  selector: '[widgetUi]',
  standalone: true,
})
export abstract class WidgetDirective<T = any> implements OnInit {
  protected abstract rawWidget: BaseWidget<T>

  private applicationRef = inject(ApplicationRef)
  private renderer2 = inject(Renderer2)
  private widgetManger: WidgetManager = new WidgetManager(console)
  protected widgetUI?: UIWidget

  get schema(): WidgetSchema.Existing | WidgetSchema.New {
    return (this.rawWidget?.id) ? WidgetSchema.Existing : WidgetSchema.New
  }

  ngOnInit(): void {
    this.widgetUI = this.widgetManger
      .fromJson(this.rawWidget, this.schema as any)
      .attachRender(this, this.renderComponent)
  }

  renderComponent(element: HTMLElement, component?: Type<any>): ComponentRef<any> | void {
    try {
      const newElement = this.getContainerElement(element);
      const environmentInjector = this.applicationRef.injector;
      const componentRef = createComponent(component!, {hostElement: newElement, environmentInjector});
      this.applicationRef.attachView(componentRef.hostView);
      componentRef.changeDetectorRef.detectChanges();
      this.widgetUI!.status = WidgetStatus.done
      return componentRef
    } catch (err) {
      this.widgetUI!.status = WidgetStatus.failed
    }
  }

  private getContainerElement(element: HTMLElement): HTMLElement {
    const newElement = this.renderer2.createElement('div');
    this.renderer2.addClass(newElement, 'widget');
    this.renderer2.appendChild(element, newElement)
    return newElement;
  }
}
