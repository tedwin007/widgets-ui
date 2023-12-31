import {Component, inject, Input} from '@angular/core';
import {BaseWidget} from "@tedwin007/widgets";
import {WithTextContent} from "../models/interfaces";
import {WidgetService} from "../widget.service";

@Component({
  selector: 'widget-ui-video-widget',
  template: `
    <header>{{title}}</header>
      <div class="content">
          <video width="100%" controls autoplay>
              <source [src]="src" type="video/mp4">
              Your browser does not support HTML video.
          </video>
      </div>
  `
})
export class VideoWidgetComponent {
  @Input() title = 'Video Widget';
  @Input() src = 'https://www.w3schools.com/html/mov_bbb.mp4'
  rawWidget: BaseWidget<WithTextContent> = inject(WidgetService).getValue()
  component = VideoWidgetComponent;
}
