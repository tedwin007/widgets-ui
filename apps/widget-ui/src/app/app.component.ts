import {Component, inject, OnDestroy} from '@angular/core';
import {RouterModule} from '@angular/router';
import {WidgetDirective} from "./widget/directives/widget.directive";
import {WidgetService} from "./widget/widget.service";
import {BaseWidget} from "@tedwin007/widgets";
import {WidgetComponentsModule} from "./widget/components/widget-components.module";
import {textWidgetTransformer} from './widget/utils';
import {WidgetTransform, WithTextContent} from "./widget/models/interfaces";
import {CommonModule} from "@angular/common";
import {WidgetTransformDirective} from "./widget/directives/widget-transform.directive";
import {TextWidgetComponent} from "./widget/components/text-widget.component";
import {VideoWidgetComponent} from "./widget/components/video-widget.component";
import {Observable, Subject} from "rxjs";
import {ExistingWidgetFormDescription, NewWidgetFormDescription} from "./app.config";
import {CapabilitiesComponent} from "./components/capabilities.component";


@Component({
  standalone: true,
  imports: [
    RouterModule,
    WidgetComponentsModule,
    WidgetDirective,
    CommonModule,
    WidgetTransformDirective,
    CapabilitiesComponent
  ],
  providers: [WidgetService],
  selector: 'widget-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  protected readonly transformer: WidgetTransform<WithTextContent> = textWidgetTransformer()
  protected readonly WidgetTypes = [TextWidgetComponent, VideoWidgetComponent]
  protected readonly TextWidgetComponent = TextWidgetComponent;
  protected readonly VideoWidgetComponent = VideoWidgetComponent;
  protected readonly newWidgetFormDescription = NewWidgetFormDescription
  protected readonly existingWidgetFormDescription = ExistingWidgetFormDescription
  protected rawWidget$!: Observable<BaseWidget>;
  private widgetService: WidgetService = inject(WidgetService);
  protected capabilities = this.widgetService.widgetCapabilities
  private ngUnsubscribe = new Subject<null>()

  constructor() {
    this.setRawWidget()
  }

  toggleCanEdit($event: boolean): void {
    const widget = this.widgetService.getValue();
    widget.config["canEdit"] = !$event
    this.widgetService.setValue({...widget})
  }

  private setRawWidget(): void {
    this.rawWidget$ = this.widgetService.getWidgets$()
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
