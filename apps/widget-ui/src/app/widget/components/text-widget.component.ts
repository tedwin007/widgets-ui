import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

/**
 Notice that the Widget's component remains independent of the 'widget' concept or entity.
 This approach aligns with the core principle of 'widgets' as embedded content.
 Essentially, any component can function as a 'widget',
 as long as it receives the necessary dependencies, primarily the 'widgetProps'.
 */
@Component({
  selector: 'widget-ui-text-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <header>{{title}}</header>
      <div class="content">
          <p [innerHTML]="text"></p>
      </div>
  `,
  styles: [``],
})
export class TextWidgetComponent {
  @Input() text = '% Place Holder %';
  @Input() title = "Text Widget";
}
