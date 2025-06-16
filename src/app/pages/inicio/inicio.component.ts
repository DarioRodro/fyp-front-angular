import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { FranquiciaService } from '../../services/franquicia.service';
import { Franquicia } from '../../models/producto.model';
import { HttpClientModule } from '@angular/common/http';
import { MarcaService } from '../../services/marca.service';
import { Marca } from '../../models/producto.model';


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
  images: string[] = [
    'assets/slider1.png',
    'assets/slider2.png',
    'assets/slider3.png',
  ];
  currentIndex: number = 0;
  intervalId: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private franquiciaService: FranquiciaService, private marcaService: MarcaService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.startAutoSlide();
    }
    this.franquiciaService.obtenerFranquicias().subscribe({
      next: (res) => {
        this.franquicias = res.data;
      },
      error: (err) => {
        console.error('Error al obtener franquicias:', err);
      }
    });
    this.marcaService.obtenerMarcas().subscribe({
      next: (res) => {
        this.marcas = res.data;
      },
      error: (err) => {
        console.error('Error al obtener marcas:', err);
      }
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
  
}
