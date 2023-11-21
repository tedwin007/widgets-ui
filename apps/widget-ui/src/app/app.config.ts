import {ApplicationConfig} from '@angular/core';
import {provideRouter, withEnabledBlockingInitialNavigation,} from '@angular/router';
import {appRoutes} from './app.routes';
import {BaseWidget} from "@tedwin007/widgets";
import {WithTextContent} from "./widget/models/interfaces";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes, withEnabledBlockingInitialNavigation())],
};

// Text Widget only
// Video Widget will fail to assign the data (on purpose) and therefore will receive the defaults hard Codded values
export const ExistingWidgetMock: BaseWidget<WithTextContent> = {
  "id": "1699525098626_1",
  "version": "1699525098626_1_v1",
  "config": {
    canEdit: true,
  },
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


export const ExistingWidgetFormDescription = 'This document outlines the procedure for modifying existing widgets. Initially, each widget is characterized by an `id` and a `version`.' +
  ' It`s important to note that altering the existing properties of a widget is not permitted, as this may lead to compatibility issues. However, you are free to introduce and modify new properties. It`s crucial to remember that this process only involves defining the anticipated UI properties (widgetProps), and does not extend to altering the data schema.';

export const NewWidgetFormDescription = 'This document outlines the creation process for a new Widget. Initially, this Widget lacks properties such as id, data, and version. To establish its properties, specify each Key (the name of the property) and the corresponding value type, which can be \'text\', \'object\', \'boolean\', or \'number\'.';
