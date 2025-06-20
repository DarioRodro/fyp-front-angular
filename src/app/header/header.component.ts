import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  activeMenu: string | null = null;
  textoBusqueda: string = '';
  resultados: any[] = [];

  constructor(private productoService: ProductoService) {}

  buscar() {
  const texto = this.textoBusqueda.trim();
  if (!texto) {
    this.resultados = [];
    return;
  }

  this.productoService.buscarProductosPorTag(texto).subscribe((res) => {
    console.log('Resultado recibido:', res); // 👈 Agrega esto
    this.resultados = res.data;
  });
}


  seleccionarProducto(productoId: number) {
    console.log('Producto seleccionado:', productoId);
    // Aquí puedes hacer: this.router.navigate(['/producto', productoId]);
  }

  openMenu(menu: string) {
    this.activeMenu = menu;
  }

  closeMenu() {
    this.activeMenu = null;
  }
}
