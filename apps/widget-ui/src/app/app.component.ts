import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BaseWidget} from '@tedwin007/widgets'
import {WidgetDirective} from "./widget/widget.directive";
import {TextWidgetComponent} from "./components/text-widget.component";
import {WidgetComponentsModule} from "./components/widget-components.module";
import {VideoWidgetComponent} from "./components/video-widget.component";
import {WidgetsApiService} from "./widgets-api.service";
import {WithTextContent} from "./models/interfaces";

@Component({
  standalone: true,
  imports: [RouterModule, WidgetComponentsModule],
  selector: 'widget-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends WidgetDirective<WithTextContent> implements OnInit, AfterViewInit {
  rawWidget: BaseWidget<WithTextContent> = inject(WidgetsApiService).getValue()

  ngAfterViewInit(): void {
    this.computeTextContent();
    this.renderWidgets();
  }

  private renderWidgets(): void {
    const widgetsWrapper: HTMLElement | null = document.querySelector('#widgets-wrapper')
    if (widgetsWrapper && this.widgetUI) {
      this.renderComponent(widgetsWrapper, TextWidgetComponent)?.setInput('text', this.widgetUI.widgetProps['text'])
      this.renderComponent(widgetsWrapper, VideoWidgetComponent)
      console.log('widgetUI', this.widgetUI)
    }
  }

  /**
   * !This logic will not stay here
   * this is an example that shows why we have duplicate props in 'widgetProps' and in 'data'
   * widgetProps.text is the computed result for concat the sections array. At the end of the day widgetProps is what the component sees and not the raw data.
   * We still want to be consistent as much as possible, that is why "widgetProps" will only contain props that appears in the "data" prop
   * meaning for the component you can nerrow the data but not extend it
   */
  private computeTextContent(): void {
    if (this.widgetUI) this.widgetUI.widgetProps['text'] = `${this.widgetUI?.data.text} ${this.widgetUI!.data.sections}`
  }

}
