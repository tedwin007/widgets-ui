import {Component, Input} from '@angular/core';

@Component({
  selector: 'widget-ui-text-widget',
  template: `
      <header>Text Widget</header>
      <div class="content">
          <p [innerHTML]="text"></p>
      </div>
  `,
  styles: [``],
})
export class TextWidgetComponent {
  @Input() text = '%placeholder%'
}
