import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideHttpClient, withFetch } from '@angular/common/http'; // 👈 Agregado
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch()) // 👈 Esta línea habilita fetch para SSR
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
