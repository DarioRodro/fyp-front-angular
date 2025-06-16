import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { FranquiciaService } from '../../services/franquicia.service';
import { MarcaService } from '../../services/marca.service';
import { PrbProductosComponent } from '../prb-productos/prb-productos.component';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterModule, CommonModule, PrbProductosComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  franquicias: { nombre: string; logoUrl: string }[] = [];
  marcas: { nombre: string; logoUrl: string }[] = [];
  filtrosLaterales: {
    nombre: string;
    logoUrl: string;
    lineas: { nombre: string; cantidad: number }[];
  }[] = [];

  opcionSeleccionada: 'franquicia' | 'marca' | 'merch' = 'franquicia';
  marcaSeleccionada: string | null = null;
  franquiciaSeleccionada: string | null = null;
  lineaSeleccionada: string | null = null;

  constructor(
    private productoService: ProductoService,
    private franquiciaService: FranquiciaService,
    private marcaService: MarcaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private esBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe((res: any) => {
      this.productos = res.data;
      if (this.esBrowser()) {
        this.restaurarFiltrosDesdeLocalStorage();
      }
    });

    this.franquiciaService.obtenerFranquicias().subscribe((res) => {
      this.franquicias = res.data.map((f: any) => ({
        nombre: f.nombre,
        logoUrl: f.logo?.url ? 'http://localhost:1337' + f.logo.url : ''
      }));
    });

    this.marcaService.obtenerMarcas().subscribe((res) => {
      this.marcas = res.data.map((m: any) => ({
        nombre: m.nombre ?? 'Sin nombre',
        logoUrl: m.logo?.url ? 'http://localhost:1337' + m.logo.url : ''
      }));
    });
  }

  cambiarOpcion(opcion: 'franquicia' | 'marca' | 'merch') {
    this.opcionSeleccionada = opcion;
    this.resetearFiltros();
    this.productoService.obtenerProductos().subscribe((res: any) => {
      this.productos = res.data;
      this.actualizarFiltrosLaterales();
    });
    if (this.esBrowser()) localStorage.setItem('filtroTipo', opcion);
  }

  filtrarPorFranquicia(nombreFranquicia: string) {
    this.productoService.obtenerProductos().subscribe((res: any) => {
      this.productos = res.data.filter((producto: any) =>
        producto.franquicia?.nombre === nombreFranquicia
      );

      this.franquiciaSeleccionada = nombreFranquicia;
      this.marcaSeleccionada = null;
      this.lineaSeleccionada = null;
      this.opcionSeleccionada = 'franquicia';
      this.actualizarFiltrosLaterales();

      if (this.esBrowser()) {
        localStorage.setItem('filtroTipo', 'franquicia');
        localStorage.setItem('filtroFranquicia', nombreFranquicia);
        localStorage.removeItem('filtroMarca');
        localStorage.removeItem('filtroLinea');
      }
    });
  }

  filtrarPorMarca(nombreMarca: string) {
    this.productoService.obtenerProductos().subscribe((res: any) => {
      this.productos = res.data.filter((producto: any) =>
        producto.marca?.nombre === nombreMarca
      );

      this.marcaSeleccionada = nombreMarca;
      this.franquiciaSeleccionada = null;
      this.lineaSeleccionada = null;
      this.opcionSeleccionada = 'marca';
      this.actualizarFiltrosLaterales();

      if (this.esBrowser()) {
        localStorage.setItem('filtroTipo', 'marca');
        localStorage.setItem('filtroMarca', nombreMarca);
        localStorage.removeItem('filtroFranquicia');
        localStorage.removeItem('filtroLinea');
      }
    });
  }

  filtrarPorLinea(nombreLinea: string) {
    if (this.lineaSeleccionada === nombreLinea) {
      this.lineaSeleccionada = null;
      if (this.esBrowser()) localStorage.removeItem('filtroLinea');
    } else {
      this.lineaSeleccionada = nombreLinea;
      if (this.esBrowser()) localStorage.setItem('filtroLinea', nombreLinea);

      const productoConLinea = this.productos.find(p => p.linea?.nombre === nombreLinea);

      if (this.opcionSeleccionada === 'marca' && this.franquiciaSeleccionada) {
        const franquiciasDeLinea = productoConLinea?.linea?.franquicias || [];
        const lineaCompatible = franquiciasDeLinea.some(f => f.nombre === this.franquiciaSeleccionada);

        if (!lineaCompatible) {
          this.franquiciaSeleccionada = null;
          if (this.esBrowser()) localStorage.removeItem('filtroFranquicia');
        }
      }

      if (this.opcionSeleccionada === 'franquicia' && this.marcaSeleccionada) {
        const marcaDeLinea = productoConLinea?.linea?.marca?.nombre;
        if (marcaDeLinea !== this.marcaSeleccionada) {
          this.marcaSeleccionada = null;
          if (this.esBrowser()) localStorage.removeItem('filtroMarca');
        }
      }
    }

    this.actualizarFiltrosLaterales();
  }

  resetearFiltros() {
    this.marcaSeleccionada = null;
    this.franquiciaSeleccionada = null;
    this.lineaSeleccionada = null;
    if (this.esBrowser()) {
      localStorage.removeItem('filtroFranquicia');
      localStorage.removeItem('filtroMarca');
      localStorage.removeItem('filtroLinea');
    }
  }

  get productosFiltrados(): Producto[] {
    let filtrados = this.productos;

    if (this.franquiciaSeleccionada) {
      filtrados = filtrados.filter(p => p.franquicia?.nombre === this.franquiciaSeleccionada);
    }

    if (this.marcaSeleccionada) {
      filtrados = filtrados.filter(p => p.marca?.nombre === this.marcaSeleccionada);
    }

    if (this.lineaSeleccionada) {
      filtrados = filtrados.filter(p => p.linea?.nombre === this.lineaSeleccionada);
    }

    return filtrados;
  }

  actualizarFiltrosLaterales() {
    const filtrosMap = new Map<string, { nombre: string; logoUrl: string; lineas: Map<string, number> }>();
    const lineasContadas = new Set<string>();

    const productosBase = this.productos.filter(p => {
      if (this.opcionSeleccionada === 'franquicia' && this.franquiciaSeleccionada) {
        return p.franquicia?.nombre === this.franquiciaSeleccionada;
      }
      if (this.opcionSeleccionada === 'marca' && this.marcaSeleccionada) {
        return p.marca?.nombre === this.marcaSeleccionada;
      }
      return false;
    });

    productosBase.forEach(producto => {
      const marca = producto.marca;
      const franquicia = producto.franquicia;
      const linea = producto.linea;

      if (!linea?.nombre) return;

      const nombreLinea = linea.nombre;
      const franquiciasDeLinea = linea.franquicias ?? [];
      const marcaDeLinea = linea.marca;

      const idUnico = this.opcionSeleccionada === 'franquicia'
        ? `${marcaDeLinea?.nombre}-${nombreLinea}`
        : `${franquicia?.nombre}-${nombreLinea}`;

      if (lineasContadas.has(idUnico)) return;
      lineasContadas.add(idUnico);

      if (this.opcionSeleccionada === 'franquicia' && this.franquiciaSeleccionada) {
        const lineaTieneFranquicia = franquiciasDeLinea.some(f => f.nombre === this.franquiciaSeleccionada);

        if (marcaDeLinea && lineaTieneFranquicia) {
          const nombreMarca = marcaDeLinea.nombre;
          const logo = marcaDeLinea.logo?.url ? 'http://localhost:1337' + marcaDeLinea.logo.url : '';

          if (!filtrosMap.has(nombreMarca)) {
            filtrosMap.set(nombreMarca, { nombre: nombreMarca, logoUrl: logo, lineas: new Map() });
          }

          const lineasMap = filtrosMap.get(nombreMarca)!.lineas;
          lineasMap.set(nombreLinea, (lineasMap.get(nombreLinea) || 0) + 1);
        }
      }

      if (this.opcionSeleccionada === 'marca' && this.marcaSeleccionada) {
        const lineaEsDeMarca = marcaDeLinea?.nombre === this.marcaSeleccionada;

        if (franquicia && lineaEsDeMarca) {
          const nombreFranq = franquicia.nombre;
          const logo = franquicia.logo?.url ? 'http://localhost:1337' + franquicia.logo.url : '';

          if (!filtrosMap.has(nombreFranq)) {
            filtrosMap.set(nombreFranq, { nombre: nombreFranq, logoUrl: logo, lineas: new Map() });
          }

          const lineasMap = filtrosMap.get(nombreFranq)!.lineas;
          lineasMap.set(nombreLinea, (lineasMap.get(nombreLinea) || 0) + 1);
        }
      }
    });

    this.filtrosLaterales = Array.from(filtrosMap.values()).map(f => ({
      nombre: f.nombre,
      logoUrl: f.logoUrl,
      lineas: Array.from(f.lineas.entries()).map(([nombre, cantidad]) => ({
        nombre,
        cantidad
      }))
    }));
  }

  filtrarMarcaDesdeFranquicia(nombreMarca: string) {
    if (this.marcaSeleccionada === nombreMarca) {
      this.marcaSeleccionada = null;
      if (this.esBrowser()) localStorage.removeItem('filtroMarca');
    } else {
      this.marcaSeleccionada = nombreMarca;
      if (this.esBrowser()) localStorage.setItem('filtroMarca', nombreMarca);
    }

    this.lineaSeleccionada = null;
    if (this.esBrowser()) localStorage.removeItem('filtroLinea');

    this.actualizarFiltrosLaterales();
  }

  filtrarFranquiciaDesdeMarca(nombreFranq: string) {
    if (this.franquiciaSeleccionada === nombreFranq) {
      this.franquiciaSeleccionada = null;
      if (this.esBrowser()) localStorage.removeItem('filtroFranquicia');
    } else {
      this.franquiciaSeleccionada = nombreFranq;
      if (this.esBrowser()) localStorage.setItem('filtroFranquicia', nombreFranq);
    }

    this.lineaSeleccionada = null;
    if (this.esBrowser()) localStorage.removeItem('filtroLinea');

    this.actualizarFiltrosLaterales();
  }

  restaurarFiltrosDesdeLocalStorage() {
    if (!this.esBrowser()) return;

    const tipo = localStorage.getItem('filtroTipo');
    const franquicia = localStorage.getItem('filtroFranquicia');
    const marca = localStorage.getItem('filtroMarca');
    const linea = localStorage.getItem('filtroLinea');

    if (tipo === 'franquicia' && franquicia) {
      this.franquiciaSeleccionada = franquicia;
      this.opcionSeleccionada = 'franquicia';
      this.productos = this.productos.filter(p => p.franquicia?.nombre === franquicia);
    } else if (tipo === 'marca' && marca) {
      this.marcaSeleccionada = marca;
      this.opcionSeleccionada = 'marca';
      this.productos = this.productos.filter(p => p.marca?.nombre === marca);
    }

    if (linea) {
      this.lineaSeleccionada = linea;
    }

    this.actualizarFiltrosLaterales();
  }

  limpiarTodosLosFiltros() {
    this.resetearFiltros();
    this.opcionSeleccionada = 'franquicia';
    if (this.esBrowser()) localStorage.setItem('filtroTipo', this.opcionSeleccionada);

    this.productoService.obtenerProductos().subscribe((res: any) => {
      this.productos = res.data;
      this.actualizarFiltrosLaterales();
    });
  }

  @ViewChild('slider', { static: false }) slider: ElementRef | undefined;

  moverSlider(direccion: number) {
    if (this.slider) {
      this.slider.nativeElement.scrollLeft += direccion * 200;
    }
  }
}
