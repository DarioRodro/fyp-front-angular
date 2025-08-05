import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-prb-productos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prb-productos.component.html',
  styleUrl: './prb-productos.component.css'
})
export class PrbProductosComponent implements OnChanges {
  @Input() productos: any[] = [];
  @Input() modo: 'horizontal' | 'grilla' = "grilla";

  constructor(public carritoService: CarritoService) {}

  ngOnChanges() {
    console.log('Productos en prb-productos:', this.productos);
  }
  
}
