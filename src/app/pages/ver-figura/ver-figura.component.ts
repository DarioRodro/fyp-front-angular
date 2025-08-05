import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';
import { PrbProductosComponent } from '../prb-productos/prb-productos.component';

@Component({
  selector: 'app-ver-figura',
  standalone: true,
  imports: [CommonModule, PrbProductosComponent],
  templateUrl: './ver-figura.component.html',
  styleUrl: './ver-figura.component.css'
})
export class VerFiguraComponent implements OnInit {

  producto: any;
  loading= true;

  imagenSeleccionada: string | null = null;
  productosRelacionados: Producto[] = [];
  
seleccionarImagen(url: string) {
  this.imagenSeleccionada = url;
}

  constructor(private route: ActivatedRoute, private productoService: ProductoService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
      // Reinicia estado antes de cargar uno nuevo
        this.loading = true;
        this.producto = null;
        this.imagenSeleccionada = null;
        this.productosRelacionados = [];

        this.productoService.obtenerProductoPorSlug(slug).subscribe({
          next: (res) => {
            this.producto = res.data?.[0] || null;
            this.imagenSeleccionada = this.producto?.Imagen?.[0]?.url || null;

            if (this.producto?.franquicia?.id) {
              this.productoService.obtenerProductosRelacionadosPorFranquicia(this.producto.franquicia.id).subscribe({
                next: (relacionados) => {
                  this.productosRelacionados = relacionados.data.filter(p => p.id !== this.producto.id);
                },
                error: (err) => console.error('Error cargando productos relacionados:', err)
              });
            }

            this.loading = false;
          },
          error: (err) => {
            console.error('Error cargando producto:', err);
            this.loading = false;
          }
        });
      }
    });
  }

}
