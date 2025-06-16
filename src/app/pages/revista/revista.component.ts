import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { CommonModule } from '@angular/common';
import { PrbProductosComponent } from '../prb-productos/prb-productos.component';

@Component({
  selector: 'app-revista',
  imports: [CommonModule, PrbProductosComponent],
  templateUrl: './revista.component.html',
  styleUrl: './revista.component.css'
})
export class RevistaComponent implements OnInit {
productosPreventa: Producto[] = [];
productosNovedades: Producto[] = [];

constructor(private productoService: ProductoService) {}

ngOnInit(): void {
  this.productoService.obtenerProductos().subscribe((res) => {
    const todos = res.data;

    this.productosPreventa = todos.filter(p =>
      p.categories?.some(cat => cat.estado?.toLowerCase() === 'preventa')
    );

    this.productosNovedades = todos.filter(p =>
      p.categories?.some(cat => cat.estado?.toLowerCase() === 'novedades')
    );
  });
}


@ViewChild('slider', { static: false }) slider: ElementRef | undefined;
@ViewChild('carousel', { static: false }) carousel!: ElementRef;

moverSlider(direccion: number) {
  if (this.slider) {
    this.slider.nativeElement.scrollLeft += direccion * 200;
  }
}
nextSlide() {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  prevSlide() {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  imagenes = [
    './assets/colecc-1.png',
    './assets/colecc-2.png',
    './assets/colecc-3.png',
    './assets/colecc-4.png'
  ]

  indiceActual = 0;

  prevSlider() {
    this.indiceActual = (this.indiceActual - 1 + this.imagenes.length) % this.imagenes.length;
  }

  nextSlider() {
    this.indiceActual = (this.indiceActual + 1) % this.imagenes.length;
  }

  indiceAnterior(): number {
    return (this.indiceActual - 1 + this.imagenes.length) % this.imagenes.length;
  }

  indiceSiguiente(): number {
    return (this.indiceActual + 1) % this.imagenes.length;
  }
}
