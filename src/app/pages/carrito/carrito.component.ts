import { Component } from '@angular/core';
import { CarritoService, ProductoCarrito } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  constructor(public carritoService: CarritoService) {}

  get productos(): ProductoCarrito[] {
    return this.carritoService.getCarrito();
  }

  eliminarProducto(id: number): void {
    this.carritoService.eliminarProducto(id);
  }

  get total(): number {
    return this.carritoService.calcularTotal();
  }

  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
  }
  confirmarVaciarCarrito(): void {
    const confirmado = window.confirm('¿Estás seguro de que deseas vaciar el carrito?');
    if (confirmado) {
      this.vaciarCarrito();
    }
  }

}
