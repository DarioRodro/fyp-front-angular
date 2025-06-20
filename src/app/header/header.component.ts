import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../services/producto.service';
import { ElementRef, HostListener, ViewChild } from '@angular/core';


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
  @ViewChild('searchBox') searchBox!: ElementRef;
  @ViewChild('resultadosBox') resultadosBox!: ElementRef;

  constructor(private productoService: ProductoService, private router: Router) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInsideInput = this.searchBox?.nativeElement.contains(event.target);
    const clickedInsideResultados = this.resultadosBox?.nativeElement.contains(event.target);

    if (!clickedInsideInput && !clickedInsideResultados) {
      this.resultados = [];
    }
  }
  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent) {
  this.resultados = [];
  }
  @HostListener('window:scroll', [])
  onScroll() {
  this.resultados = [];
  }

  selectedIndex: number = -1;

@HostListener('document:keydown', ['$event'])
handleKeyDown(event: KeyboardEvent) {
  if (this.resultados.length === 0) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % this.resultados.length;
      this.scrollToActive();
    break;
    case 'ArrowUp':
      event.preventDefault();
      this.selectedIndex = (this.selectedIndex - 1 + this.resultados.length) % this.resultados.length;
      this.scrollToActive();
    break;
    case 'Enter':
      if (this.selectedIndex >= 0 && this.selectedIndex < this.resultados.length) {
        this.seleccionarProducto(this.resultados[this.selectedIndex]);
      }
      break;
    case 'Escape':
      this.resultados = [];
      break;
  }
}
scrollToActive() {
  setTimeout(() => {
    const activeElement = document.querySelector('.resultado.activo');
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 50);
}


  buscar() {
  const texto = this.textoBusqueda.trim();
  if (!texto) {
    this.resultados = [];
    this.selectedIndex = -1;
    return;
  }

  this.productoService.buscarProductosPorTag(texto).subscribe((res) => {
    this.resultados = res.data;
    this.selectedIndex = this.resultados.length > 0 ? 0 : -1; // 👈 Selecciona automáticamente el primero
    this.scrollToActive();
  });
}


  seleccionarProducto(producto: any) {
  this.resultados = []; // Ocultamos resultados
  this.router.navigate(['/figura', producto.slug]);
}

  openMenu(menu: string) {
    this.activeMenu = menu;
  }

  closeMenu() {
    this.activeMenu = null;
  }
}
