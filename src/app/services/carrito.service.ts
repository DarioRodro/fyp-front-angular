// src/app/services/carrito.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Producto } from '../models/producto.model';

export interface ProductoCarrito extends Producto {
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private productosEnCarrito: ProductoCarrito[] = [];
  private readonly STORAGE_KEY = 'fidyuapon-carrito';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.cargarDesdeLocalStorage();
    }
  }

  getCarrito(): ProductoCarrito[] {
    return this.productosEnCarrito;
  }

  agregarProducto(producto: Producto): void {
    const existente = this.productosEnCarrito.find(p => p.id === producto.id);
    if (existente) {
      existente.cantidad += 1;
    } else {
      this.productosEnCarrito.push({ ...producto, cantidad: 1 });
    }
    this.guardarEnLocalStorage();
  }

  eliminarProducto(productoId: number): void {
    this.productosEnCarrito = this.productosEnCarrito.filter(p => p.id !== productoId);
    this.guardarEnLocalStorage();
  }

  calcularTotal(): number {
    return this.productosEnCarrito.reduce((total, p) => total + p.Precio * p.cantidad, 0);
  }

  vaciarCarrito(): void {
    this.productosEnCarrito = [];
    this.guardarEnLocalStorage();
  }

  private guardarEnLocalStorage(): void {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.productosEnCarrito));
    }
  }

  private cargarDesdeLocalStorage(): void {
    if (this.isBrowser) {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        try {
          this.productosEnCarrito = JSON.parse(data);
        } catch (error) {
          console.error('Error al cargar carrito desde localStorage:', error);
          this.productosEnCarrito = [];
        }
      }
    }
  }
}
