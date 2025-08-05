import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { PrbProductosComponent } from '../prb-productos/prb-productos.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-revista',
  standalone: true,
  imports: [CommonModule, PrbProductosComponent, RouterModule],
  templateUrl: './revista.component.html',
  styleUrl: './revista.component.css'
})
export class RevistaComponent implements OnInit, AfterViewInit {
  productosPreventa: Producto[] = [];
  productosNovedades: Producto[] = [];
  seccionActiva: 'preventa' | 'novedades' | 'todas' = 'todas';
  touchStartX = 0;
  touchEndX = 0;

  @ViewChild('sliderAnuncios', { static: false }) sliderAnuncios!: ElementRef<HTMLDivElement>;
  @ViewChild('slider', { static: false }) slider: ElementRef | undefined;
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  imagenes = [
    './assets/colecc-1.png',
    './assets/colecc-2.png',
    './assets/colecc-3.png',
    './assets/colecc-4.png'
  ];
  indiceActual = 0;

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.seccionActiva = 'todas';
    this.cargarProductos();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url.startsWith('/revista')) {
          this.cargarProductos(); // 👈 Se vuelve a cargar al volver a la ruta
        }
      });
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const el = document.getElementById(fragment);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    });

    const slider = this.sliderAnuncios.nativeElement;

    if (window.innerWidth <= 1024 && slider) {
      const slideWidth = slider.firstElementChild?.clientWidth || 300;
      const spacing = 10;
      const totalScroll = slider.scrollWidth;
      const visibleWidth = slider.clientWidth;

      let position = 0;

      setInterval(() => {
        if (position + visibleWidth >= totalScroll) {
          position = 0;
        } else {
          position += slideWidth + spacing;
        }

        slider.scrollTo({
          left: position,
          behavior: 'smooth'
        });
      }, 2500);

      slider.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      });

      slider.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipeGesture();
      });
    }
  }

  private cargarProductos(): void {
    this.productoService.obtenerProductosPaginados(1, 1000).subscribe((res) => {
      const todos = res.data;

      this.productosPreventa = todos.filter((p: any) =>
        p.categories?.some((cat: any) => cat.estado?.toLowerCase() === 'preventa')
      );

      this.productosNovedades = todos.filter((p: any) =>
        p.categories?.some((cat: any) => cat.estado?.toLowerCase() === 'novedades')
      );
    });
  }

  handleSwipeGesture(): void {
    const distancia = this.touchStartX - this.touchEndX;
    if (Math.abs(distancia) > 50) {
      if (distancia > 0) {
        this.nextSlider();
      } else {
        this.prevSlider();
      }
    }
  }

  moverSlider(direccion: number): void {
    if (this.slider) {
      this.slider.nativeElement.scrollLeft += direccion * 200;
    }
  }

  nextSlide(): void {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  prevSlide(): void {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  prevSlider(): void {
    this.indiceActual = (this.indiceActual - 1 + this.imagenes.length) % this.imagenes.length;
  }

  nextSlider(): void {
    this.indiceActual = (this.indiceActual + 1) % this.imagenes.length;
  }

  indiceAnterior(): number {
    return (this.indiceActual - 1 + this.imagenes.length) % this.imagenes.length;
  }

  indiceSiguiente(): number {
    return (this.indiceActual + 1) % this.imagenes.length;
  }
}
