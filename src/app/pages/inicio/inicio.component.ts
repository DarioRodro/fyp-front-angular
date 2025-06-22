/// <reference types="google.maps" />
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FranquiciaService } from '../../services/franquicia.service';
import { Franquicia, Marca } from '../../models/producto.model';
import { HttpClientModule } from '@angular/common/http';
import { MarcaService } from '../../services/marca.service';
import { environment } from '../../../environments/environment';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit, OnDestroy {
  franquicias: Franquicia[] = [];
  marcas: Marca[] = [];
  images: string[] = ['assets/slider1.png', 'assets/slider2.png', 'assets/slider3.png'];
  currentIndex = 0;
  intervalId: any;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private franquiciaService: FranquiciaService,
    private marcaService: MarcaService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.startAutoSlide();
      this.cargarGoogleMaps();
    }

    this.franquiciaService.obtenerFranquicias().subscribe({
      next: (res) => (this.franquicias = res.data),
      error: (err) => console.error('Error al obtener franquicias:', err),
    });

    this.marcaService.obtenerMarcas().subscribe({
      next: (res) => (this.marcas = res.data),
      error: (err) => console.error('Error al obtener marcas:', err),
    });
  }

  ngOnDestroy() {
    if (this.isBrowser && this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.resetInterval();
  }

  getSliderTransform(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  resetInterval() {
    clearInterval(this.intervalId);
    this.startAutoSlide();
  }

  // ✅ NUEVO: Usar loader oficial de Google
  private async cargarGoogleMaps() {
    const loader = new Loader({
      apiKey: environment.googleMapsApiKey,
      version: 'weekly',
      libraries: ['marker']
    });

    try {
      const google = await loader.load();
      const geocoder = new google.maps.Geocoder();
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

      const direccion = 'WXR8+25F, La Victoria 15033';
      const contenedor = document.getElementById('mapa');

      if (!contenedor) return;

      geocoder.geocode({ address: direccion }, (results, status) => {
        if (status === 'OK' && results && results[0].geometry?.location) {
          const map = new google.maps.Map(contenedor, {
            center: results[0].geometry.location,
            zoom: 15,
            mapId: 'faa74c3baedaa555da8bb54a', // tu mapId aquí
          });

          new AdvancedMarkerElement({
            map,
            position: results[0].geometry.location,
            title: direccion,
          });
        } else {
          console.error('No se pudo geocodificar la dirección:', status);
        }
      });

    } catch (err) {
      console.error('Error cargando Google Maps:', err);
    }
  }
}
