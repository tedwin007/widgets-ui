import {ApplicationConfig} from '@angular/core';
import {provideRouter, withEnabledBlockingInitialNavigation,} from '@angular/router';
import {appRoutes} from './app.routes';
import {BaseWidget} from "@tedwin007/widgets";
import {WithTextContent} from "./models/interfaces";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes, withEnabledBlockingInitialNavigation())],
};

export const ExistingWidgetMock: BaseWidget<WithTextContent> = {
  "id": "1699525098626_1",
  "version": "1699525098626_1_v1",
  "config": {},
  "widgetProps": {
    text: ""
  },
  data: {
    text: "\"text\": is the <b>main content</b> in which the other the sections will be merged into",
    sections: [
      "This is section 1",
      "this is section 2",
      "<br><u>Take a look at the console to the the instantiated widget</u>"
    ]
  }
}
