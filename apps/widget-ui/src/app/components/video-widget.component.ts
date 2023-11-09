import {Component, Input} from '@angular/core';

@Component({
  selector: 'widget-ui-video-widget',
  template: `
      <header>Video Widget</header>
      <div class="content">
          <video width="100%" controls autoplay>
              <source [src]="src" type="video/mp4">
              Your browser does not support HTML video.
          </video>
      </div>
  `,
  styles: [``],
})
export class VideoWidgetComponent {
  @Input() src = 'https://www.w3schools.com/html/mov_bbb.mp4'
}
