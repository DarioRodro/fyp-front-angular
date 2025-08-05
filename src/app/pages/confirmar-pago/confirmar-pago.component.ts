import { Component } from '@angular/core';
import { CarritoService, ProductoCarrito } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmar-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmar-pago.component.html',
  styleUrl: './confirmar-pago.component.css'
})
export class ConfirmarPagoComponent {
  constructor(public carritoService: CarritoService) {}

  get productos(): ProductoCarrito[] {
    return this.carritoService.getCarrito();
  }

  get total(): number {
    return this.carritoService.calcularTotal();
  }

  confirmarPago(): void {
    alert('AQUÍ VA LA INTEGRACIÓN CON MERCAGOPAGO');
    // Luego acá llamas a la API de pago real
  }
}
