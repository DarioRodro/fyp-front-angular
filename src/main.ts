import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';
import localeEsPE from '@angular/common/locales/es-PE';
import localeEsPEExtra from '@angular/common/locales/extra/es-PE';


registerLocaleData(localeEs, 'es');
registerLocaleData(localeEsPE, 'es-PE');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
