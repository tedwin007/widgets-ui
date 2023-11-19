import {BaseWidget, UIWidget} from "@tedwin007/widgets";
import {Type} from "@angular/core";

export interface WithTextContent {
  text: string,
  sections: string[]
}

type TransformValue<T, k extends keyof BaseWidget<T>['widgetProps']> =
  (() => BaseWidget<T>['widgetProps'][k])
  | BaseWidget<T>['widgetProps'][k];

export type WidgetPropsKeys<T> = keyof BaseWidget<T>['widgetProps'];
export type WidgetTransform<T> =
  Partial<{ [k in WidgetPropsKeys<T>]: TransformValue<T, k> }>
  & Record<string, any>

export interface RenderParams<T = any> {
  element: HTMLElement,
  component: Type<any>,
  widget: UIWidget,
  transform?: <T>(widget: BaseWidget<T>) => WidgetTransform<T>
}
export type WidgetProps = BaseWidget['widgetProps'];
