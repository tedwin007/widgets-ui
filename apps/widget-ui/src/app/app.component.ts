import {Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {WidgetDirective} from "./widget/directives/widget.directive";
import {WidgetService} from "./widget/widget.service";
import {BaseWidget} from "@tedwin007/widgets";
import {ApiService} from "./api.service";
import {WidgetComponentsModule} from "./widget/components/widget-components.module";
import { TextWidgetComponent } from './widget/components/text-widget.component';
import {VideoWidgetComponent} from "./widget/components/video-widget.component";
import { textWidgetTransformer } from './widget/utils';
import {WidgetTransform, WithTextContent} from "./widget/models/interfaces";

@Component({
  standalone: true,
  imports: [RouterModule, WidgetComponentsModule, WidgetDirective],
  providers: [WidgetService],
  selector: 'widget-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // Video Widget
  protected readonly VideoWidgetComponent = VideoWidgetComponent; // will get the default value (hard coded src input)
  // Text Widget
  rawWidget: BaseWidget = inject(ApiService).getValue(); // text widget only
  protected readonly TextWidgetComponent = TextWidgetComponent;
  transformer:WidgetTransform<WithTextContent> = textWidgetTransformer(this.rawWidget);
}
