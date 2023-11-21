import {ApplicationRef, ComponentRef, createComponent, inject, Renderer2} from "@angular/core";
import {BaseWidget, UIWidget, WidgetStatus} from "@tedwin007/widgets";
import {RenderParams, WidgetTransform, WithTextContent} from "./models/interfaces";


/**
 * Renders a component based on provided parameters.
 *
 * ## Overview
 * This function manages the rendering of a UI widget component. It utilizes Angular's Dependency Injection to obtain instances of `Renderer2` and `ApplicationRef` for DOM manipulation and Angular application management.
 *
 * ## Usage
 * - First, it creates a new element to host the widget.
 * - Then, it instantiates the component and sets its inputs.
 * - Finally, it attaches the component to the Angular application for rendering.
 *
 * ## Internal Functions
 * - `setWidgetInputs`: Sets the input properties of the component based on the widget's properties.
 * - `getWidgetElement`: Creates a new HTML element to serve as the container for the widget.
 * - `render`: A closure that orchestrates the rendering process.
 *
 * ## References
 * - {@link setWidgetInputs}
 * - {@link getWidgetElement}
 *
 * @returns A closure function that takes {@link RenderParams} and returns a `ComponentRef`.
 */
export const renderByComponent = function () {
  const renderer2 = inject(Renderer2)
  const applicationRef = inject(ApplicationRef)

  /**
   * ## Set Widget Inputs
   * @description This function will set the component @Input by the widgetProps of the widget's json
   * if you want to do data manipulation on a widget's prop (widget.widgetProps[key]) it should happen before.. (for now)
   * {@link  AppComponent.computeTextContent}
   * @param widget
   * @param componentRef
   */
  function setWidgetInputs(widget: UIWidget, componentRef: ComponentRef<any>) {
    const widgetProps: string[] = Object.keys(widget.widgetProps);

    widgetProps.forEach((key) => {
      componentRef.setInput(key, widget.widgetProps[key])
    })
  }

  /**
   * ## Get Widget Element
   * @description This will wrap the content within <div class='widget'>Content...</div>
   * and then push to the widgetsContainer (the parent element)
   * @param widgetsContainer
   */
  function getWidgetElement(widgetsContainer: HTMLElement) {
    const newElement = renderer2.createElement('div');
    renderer2.addClass(newElement, 'widget');
    renderer2.appendChild(widgetsContainer, newElement)
    return newElement;
  }


  return ({element, component, widget, transform}: RenderParams) => {
    const newElement = getWidgetElement(element);
    const componentRef = createComponent(component, {
      hostElement: newElement,
      environmentInjector: applicationRef.injector
    });

    if (transform) {
      widget.widgetProps = transform(widget)
    }

    setWidgetInputs(widget, componentRef)
    applicationRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();
    widget.status = WidgetStatus.done;
    return componentRef
  }
}


/**
 * ## Text Widget Transformer
 * Example for Transformer function (Text Widget)
 * Each key is either a transform function Or a value.
 * When passed to {@link WidgetTransformDirective} the result will be assigned the values of the Widget's component (widgetProps).
 * @param widget
 */
export function textWidgetTransformer(): WidgetTransform {
  return {
    text: (widget: BaseWidget<WithTextContent>): string => `${widget?.data?.text} ${widget.data?.sections.join("<br>")}`
  }
}

export function getNewWidgetTemplate(): BaseWidget {
  return {
    widgetProps: {},
    config: {}
  }
}


export function getTypeOf(value: string):string {
  switch (value) {
    case "bigint":
    case "number":
      return 'number'
    case "boolean":
      return 'boolean'
    case "function":
    case "undefined":
    case "object":
      return 'object'
    case "string":
    case "symbol":
      return 'text'
    default:
      return 'text'
  }
}

export function toContentEditable(walker = document.querySelector('.widget')!.childNodes) {
  walker.forEach((node: ChildNode) => {
    if (node.childNodes.length) toContentEditable(node.childNodes)

    if (node.nodeType === 3) {
      const editableDiv = document.createElement('span');
      editableDiv.contentEditable = 'true';
      editableDiv.textContent = node.nodeValue;
      node.parentNode?.replaceChild(editableDiv, node);
    }
  });

}

export function disableContentEditable(): void {
  const editableElements = document.querySelectorAll('[contenteditable="true"]');
  editableElements.forEach((element: any) => element.contentEditable = 'false');
}
