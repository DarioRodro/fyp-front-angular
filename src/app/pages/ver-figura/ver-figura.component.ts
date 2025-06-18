import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-figura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-figura.component.html',
  styleUrl: './ver-figura.component.css'
})
export class VerFiguraComponent implements OnInit {

  producto: any;
  loading= true;

  constructor(private route: ActivatedRoute, private productoService: ProductoService) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
     console.log('Componente cargado');
    if (slug) {
      this.productoService.obtenerProductoPorSlug(slug).subscribe({
        next: (res) => {
          this.producto = res.data?.[0] || null;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando producto:', err);
          this.loading = false;
        }
      });
    }
  }
}
