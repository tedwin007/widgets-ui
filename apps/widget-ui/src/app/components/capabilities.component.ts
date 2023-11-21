import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {BaseWidget} from "@tedwin007/widgets";

@Component({
  selector: 'widget-ui-capabilities',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="capabilities-wrapper">
      <h2>Capabilities:</h2>

      <div class="capabilities">
        <div class="flex">
          <label for="canEdit"><b>CanEdit</b></label>
          <input id="canEdit" type="checkbox"
                 [checked]="config['canEdit']"
                 (click)="toggleCanEdit.emit(this.config.canEdit)">
        </div>
        <br>
        <div>
          When the 'canEdit' capability is enabled, you have the ability to alter the text content. This
          illustrates the
          nature of capabilities and their relationship to the widget's configuration, as defined by its
          'config'
          property.
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      width: 100%;
      position: relative;
      display: inherit;
    }

    .capabilities {
      display: grid;
      grid-template-rows: 1fr auto;
      justify-items: start;

      #canEdit {
        justify-self: start;
      }
    }
  `]
})
export class CapabilitiesComponent {
  @Input() config: BaseWidget['config']
  @Output() toggleCanEdit = new EventEmitter<boolean>();
}
