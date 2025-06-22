import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-mapa',
  standalone: true,
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        const geocoder = new google.maps.Geocoder();
        const direccion = 'Av. Javier Prado Este 1200, Lima, Perú'; // 🟡 Cámbiala si deseas

        geocoder.geocode({ address: direccion }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const mapa = new google.maps.Map(
              document.getElementById("mapa") as HTMLElement,
              {
                center: results[0].geometry.location,
                zoom: 15
              }
            );

            new google.maps.Marker({
              map: mapa,
              position: results[0].geometry.location,
              title: direccion
            });
          } else {
            console.error('No se pudo encontrar la dirección:', status);
          }
        });
      };
    }
  }
}
