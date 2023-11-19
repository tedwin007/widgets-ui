import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BaseWidget} from "@tedwin007/widgets";
import {WidgetService} from "../../../widget.service";

@Component({
  selector: 'widget-ui-save-result',
  standalone: true,
  styles:[`
    .schema {
      margin: 20px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    .property {
      margin-bottom: 20px;
    }

    .sub-property {
      margin-left: 20px;
      border-left: 2px solid #eee;
      padding-left: 10px;
    }

    .property h3, .property h4, .property h5 {
      margin: 10px 0;
      display: inline-block;
    }
`],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
      <div>
          <h2>Widget Processing Overview</h2>
          <ul>
              <li><strong>Initialization:</strong> Widgets are initialized using the "Widget's lib"
                  (@tedwin007/widgets).
                  This
                  involves creating instances of BaseWidget or WidgetUi.
              </li>
              <li><strong>Validation:</strong> Data is validated against a defined Schema.</li>
              <li><strong>Transformation:</strong> Data is structured into a JSON format.</li>
          </ul>

          <p>
              Fields such as "id" and "version" are automatically generated if they do not already exist.
          </p>

          <p>
              Custom Schema validation can be defined for widgets. To validate your widgets, use the following method:
          </p>

          <code>WidgetManger.fromJson(widget, WidgetSchema.custom, customSchema)</code>

          <p>
              Note: The schema is separate from the widget object. Store the customSchema in your database and perform
              validation using a join operation between Widget and Schema.
          </p>
      </div>

      <hr>

      <div>
          <h2>Widget Object properties</h2>
          <div class="property">
              <div class="sub-property">
                  <span *ngIf="rawWidget['id']">id, version ,data, widgetProps : [
                  <span *ngFor="let item of rawWidget['widgetProps']|keyvalue">{{item.key}}, </span>]
                  </span>
              </div>
          </div>
      </div>

      <hr>

      <div>
          <h2>Widget Schema</h2>
          <div class="property">
              <ng-container *ngFor="let item of schema |keyvalue">
                  <div class="sub-property" *ngIf="!(item.key==='properties')">
                      <span> <h4>{{item.key}} :</h4> {{item.value}}</span>
                  </div>
              </ng-container>

              <ng-container *ngFor="let item of schema.properties |keyvalue">
                  <div class="sub-property" *ngIf="!(item.key==='properties')">
                      <span> <h4>{{item.key}} :</h4> {{item.value | json}}</span>
                  </div>
              </ng-container>
          </div>
      </div>
      <hr>
      <div>
          <h2>Raw Widget</h2>
          <div class="property">
              {{rawWidget | json }}
          </div>
      </div>
  `,
})
export class WidgetSaveResultComponent {
  protected schema: any;

  get rawWidget(): BaseWidget {
    return this._rawWidget;
  }

  @Input() set rawWidget(value: BaseWidget) {
    console.log(value)
    this.schema = this.widgetService.buildCustomSchema(value.widgetProps, !!value.id)
    console.log("this.schema",this.schema)
    this._rawWidget = value;
  }

  private _rawWidget!: BaseWidget;
  private widgetService = inject(WidgetService)

}
