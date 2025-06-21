import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';
import localeEsPE from '@angular/common/locales/es-PE';
import localeEsPEExtra from '@angular/common/locales/extra/es-PE';

import { Router } from '@angular/router'; // 👈 Importa Router

registerLocaleData(localeEs, 'es');
registerLocaleData(localeEsPE, 'es-PE');

bootstrapApplication(AppComponent, appConfig).then(appRef => {
  const router = appRef.injector.get(Router); // 👈 Inyecta el router

  // Suscríbete a los eventos de navegación
  router.events.subscribe(event => {
    if (event.constructor.name === 'NavigationEnd') {
      window.scrollTo({ top: 0, behavior: 'auto' }); // 👈 Hace scroll al top
    }
  });
}).catch((err) => console.error(err));
