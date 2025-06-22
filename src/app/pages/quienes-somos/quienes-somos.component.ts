import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './quienes-somos.component.html',
  styleUrl: './quienes-somos.component.css'
})
export class QuienesSomosComponent implements OnInit {
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.cargarGoogleMaps();
    }
  }

  private async cargarGoogleMaps() {
    const loader = new Loader({
      apiKey: environment.googleMapsApiKey,
      version: 'weekly',
      libraries: ['marker'] // para usar AdvancedMarkerElement
    });

    try {
      const google = await loader.load();

      const geocoder = new google.maps.Geocoder();
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

      const ubicaciones = [
        { direccion: 'Av. Miguel Grau 122, La Victoria 15033', id: 'map-feria' },
        { direccion: 'Jirón José Gálvez 589, Magdalena del Mar 15086', id: 'map-magda' },
      ];

      for (const { direccion, id } of ubicaciones) {
        const contenedor = document.getElementById(id);
        if (!contenedor) continue;

        geocoder.geocode({ address: direccion }, (results, status) => {
          if (status === 'OK' && results && results[0].geometry?.location) {
            const map = new google.maps.Map(contenedor, {
              center: results[0].geometry.location,
              zoom: 15,
              mapId: 'faa74c3baedaa555da8bb54a',
            });

            new AdvancedMarkerElement({
              map,
              position: results[0].geometry.location,
              title: direccion,
            });
          } else {
            console.error(`No se pudo geocodificar ${direccion}:`, status);
          }
        });
      }

    } catch (err) {
      console.error('Error cargando Google Maps:', err);
    }
  }
}
