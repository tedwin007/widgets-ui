import {Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {WidgetDirective} from "./widget/directives/widget.directive";
import {Capabilities, WidgetService} from "./widget/widget.service";
import {BaseWidget} from "@tedwin007/widgets";
import {WidgetComponentsModule} from "./widget/components/widget-components.module";
import {textWidgetTransformer} from './widget/utils';
import {WidgetTransform, WithTextContent} from "./widget/models/interfaces";
import {CommonModule} from "@angular/common";
import {WidgetTransformDirective} from "./widget/directives/widget-transform.directive";
import {TextWidgetComponent} from "./widget/components/text-widget.component";
import {VideoWidgetComponent} from "./widget/components/video-widget.component";

@Component({
  standalone: true,
  imports: [RouterModule, WidgetComponentsModule, WidgetDirective, CommonModule, WidgetTransformDirective],
  providers: [WidgetService],
  selector: 'widget-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private widgetService: WidgetService = inject(WidgetService);
  protected readonly TextWidgetComponent = TextWidgetComponent;
  protected readonly VideoWidgetComponent = VideoWidgetComponent;
  protected readonly newWidgetFormDescription = 'This document outlines the creation process for a new Widget. Initially, this Widget lacks properties such as id, data, and version. To establish its properties, specify each Key (the name of the property) and the corresponding value type, which can be \'text\', \'object\', \'boolean\', or \'number\'.'
  protected readonly existingWidgetFormDescription = 'This document outlines the procedure for modifying existing widgets. Initially, each widget is characterized by an `id` and a `version`.' +
      ' It`s important to note that altering the existing properties of a widget is not permitted, as this may lead to compatibility issues. However, you are free to introduce and modify new properties. It`s crucial to remember that this process only involves defining the anticipated UI properties (widgetProps), and does not extend to altering the data schema.'
  rawWidget!: BaseWidget;
  transformer: WidgetTransform<WithTextContent>;
  capabilities!: (keyof Capabilities)[]

  constructor() {
    this.setRawWidget()
    this.setCapabilities()
    this.transformer = textWidgetTransformer(this.rawWidget);
  }

  toggleCanEdit(): void {
    const widget = this.widgetService.getValue();
    const canEdit = widget.config["canEdit"];
    widget.config["canEdit"] = !canEdit
    this.widgetService.setValue(widget)
    this.setRawWidget()
    this.setCapabilities()
  }

  private setCapabilities(): void {
    this.capabilities = ['canEdit']
  }

  private setRawWidget(): void {
    this.rawWidget = this.widgetService.getValue()
  }
}
