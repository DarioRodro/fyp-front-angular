import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { FranquiciaService } from '../../services/franquicia.service';
import { MarcaService } from '../../services/marca.service';
import { PrbProductosComponent } from '../prb-productos/prb-productos.component';
import { Producto } from '../../models/producto.model';
import { ActivatedRoute } from '@angular/router';

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
  filtroTipo: 'franquicia' | 'marca' | null = null;
  filtroNombre: string | null = null;

  opcionSeleccionada: 'franquicia' | 'marca' = 'franquicia';
  marcaSeleccionada: string | null = null;
  franquiciaSeleccionada: string | null = null;
  lineaSeleccionada: string | null = null;

  constructor(
    private productoService: ProductoService,
    private franquiciaService: FranquiciaService,
    private marcaService: MarcaService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
  this.cargarFranquicias();
  this.cargarMarcas();

  this.route.queryParams.subscribe(async params => {
    const tipo = params['tipo'] as 'franquicia' | 'marca' | null;
    const nombre = params['nombre'] ?? null;
    const linea = params['linea'] ?? null;

    this.filtroTipo = tipo;
    this.filtroNombre = nombre;
    this.lineaSeleccionada = linea;

    if (tipo && nombre) {
      await this.aplicarFiltro(tipo, nombre, false); // 👈 sin actualizar la URL
    } else {
      this.cargarProductos();
    }

    if (linea) {
      this.guardarEnStorage({ filtroLinea: linea });
    }
  });
}


  private actualizarQueryParams() {
    const queryParams: any = {
      tipo: this.opcionSeleccionada,
    };
    if (this.opcionSeleccionada === 'franquicia' && this.franquiciaSeleccionada) {
      queryParams.nombre = this.franquiciaSeleccionada;
    } else if (this.opcionSeleccionada === 'marca' && this.marcaSeleccionada) {
      queryParams.nombre = this.marcaSeleccionada;
    }
    if (this.lineaSeleccionada) {
      queryParams.linea = this.lineaSeleccionada;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private esBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private guardarEnStorage(claves: { [key: string]: string | null }) {
    if (!this.esBrowser()) return;
    for (const [clave, valor] of Object.entries(claves)) {
      valor === null ? localStorage.removeItem(clave) : localStorage.setItem(clave, valor);
    }
  }

  private cargarProductos(inicial = false): void {
    this.productoService.obtenerProductos().subscribe((res: any) => {
      this.productos = res.data;
      inicial ? this.restaurarFiltrosDesdeLocalStorage() : this.actualizarFiltrosLaterales();
    });
  }

  private cargarFranquicias(): void {
    this.franquiciaService.obtenerFranquicias().subscribe((res) => {
      this.franquicias = res.data.map((f: any) => ({
        nombre: f.nombre,
        logoUrl: f.logo?.url ? 'http://localhost:1337' + f.logo.url : ''
      }));
    });
  }

  private cargarMarcas(): void {
    this.marcaService.obtenerMarcas().subscribe((res) => {
      this.marcas = res.data.map((m: any) => ({
        nombre: m.nombre ?? 'Sin nombre',
        logoUrl: m.logo?.url ? 'http://localhost:1337' + m.logo.url : ''
      }));
    });
  }

  cambiarOpcion(opcion: 'franquicia' | 'marca') {
    this.opcionSeleccionada = opcion;
    this.resetearFiltros();
    this.cargarProductos();
    this.guardarEnStorage({ filtroTipo: opcion });
    this.actualizarQueryParams();
  }

  private aplicarFiltro(
  tipo: 'franquicia' | 'marca',
  nombre: string,
  actualizarURL: boolean = true
): Promise<void> {
  return new Promise((resolve) => {
    this.productoService.obtenerProductos().subscribe((res: any) => {
      this.productos = res.data.filter((p: any) =>
        tipo === 'franquicia'
          ? p.franquicia?.nombre === nombre
          : p.marca?.nombre === nombre
      );

      this.opcionSeleccionada = tipo;
      this.franquiciaSeleccionada = tipo === 'franquicia' ? nombre : null;
      this.marcaSeleccionada = tipo === 'marca' ? nombre : null;
      this.lineaSeleccionada = this.lineaSeleccionada ?? null;

      this.guardarEnStorage({
        filtroTipo: tipo,
        filtroFranquicia: this.franquiciaSeleccionada,
        filtroMarca: this.marcaSeleccionada,
        filtroLinea: this.lineaSeleccionada,
      });

      this.actualizarFiltrosLaterales();

      // ✅ Actualiza la URL solo si fue solicitado
      if (actualizarURL) {
        const queryParams: any = {
          tipo: tipo,
          nombre: nombre,
        };
        if (this.lineaSeleccionada) {
          queryParams['linea'] = this.lineaSeleccionada;
        }

        this.routeTo(queryParams);
      }

      resolve();
    });
  });
}


  filtrarPorFranquicia(nombre: string) {
    this.aplicarFiltro('franquicia', nombre);
  }

  filtrarPorMarca(nombre: string) {
    this.aplicarFiltro('marca', nombre);
  }

  filtrarPorLinea(nombreLinea: string) {
    if (this.lineaSeleccionada === nombreLinea) {
      this.lineaSeleccionada = null;
      this.guardarEnStorage({ filtroLinea: null });
    } else {
      this.lineaSeleccionada = nombreLinea;
      this.guardarEnStorage({ filtroLinea: nombreLinea });

      const producto = this.productos.find(p => p.linea?.nombre === nombreLinea);
      if (!producto) return;

      const marcaDeLinea = producto.linea?.marca?.nombre;
      const franquiciasDeLinea = producto.linea?.franquicias || [];

      if (this.opcionSeleccionada === 'marca' && this.franquiciaSeleccionada) {
        const esCompatible = franquiciasDeLinea.some(f => f.nombre === this.franquiciaSeleccionada);
        if (!esCompatible) this.guardarEnStorage({ filtroFranquicia: null });
      }

      if (this.opcionSeleccionada === 'franquicia' && this.marcaSeleccionada) {
        if (marcaDeLinea !== this.marcaSeleccionada) this.guardarEnStorage({ filtroMarca: null });
      }
    }

    this.actualizarFiltrosLaterales();
    this.actualizarQueryParams();
  }

  get productosFiltrados(): Producto[] {
    return this.productos.filter(p => {
      const coincideFranquicia = this.franquiciaSeleccionada ? p.franquicia?.nombre === this.franquiciaSeleccionada : true;
      const coincideMarca = this.marcaSeleccionada ? p.marca?.nombre === this.marcaSeleccionada : true;
      const coincideLinea = this.lineaSeleccionada ? p.linea?.nombre === this.lineaSeleccionada : true;
      return coincideFranquicia && coincideMarca && coincideLinea;
    });
  }

  resetearFiltros() {
    this.marcaSeleccionada = null;
    this.franquiciaSeleccionada = null;
    this.lineaSeleccionada = null;
    this.guardarEnStorage({
      filtroFranquicia: null,
      filtroMarca: null,
      filtroLinea: null
    });
  }

  actualizarFiltrosLaterales() {
    const filtrosMap = new Map<string, { nombre: string; logoUrl: string; lineas: Map<string, number> }>();
    const lineasContadas = new Set<string>();

    const base = this.productos.filter(p => {
      if (this.opcionSeleccionada === 'franquicia' && this.franquiciaSeleccionada) {
        return p.franquicia?.nombre === this.franquiciaSeleccionada;
      }
      if (this.opcionSeleccionada === 'marca' && this.marcaSeleccionada) {
        return p.marca?.nombre === this.marcaSeleccionada;
      }
      return false;
    });

    base.forEach(p => {
      const linea = p.linea;
      if (!linea?.nombre) return;

      const idUnico = this.opcionSeleccionada === 'franquicia'
        ? `${linea.marca?.nombre}-${linea.nombre}`
        : `${p.franquicia?.nombre}-${linea.nombre}`;

      if (lineasContadas.has(idUnico)) return;
      lineasContadas.add(idUnico);

      const nombreGrupo = this.opcionSeleccionada === 'franquicia'
        ? linea.marca?.nombre
        : p.franquicia?.nombre;

      const logoUrl = this.opcionSeleccionada === 'franquicia'
        ? linea.marca?.logo?.url
        : p.franquicia?.logo?.url;

      if (!nombreGrupo || !logoUrl) return;

      const fullLogo = 'http://localhost:1337' + logoUrl;

      if (!filtrosMap.has(nombreGrupo)) {
        filtrosMap.set(nombreGrupo, { nombre: nombreGrupo, logoUrl: fullLogo, lineas: new Map() });
      }

      const lineasMap = filtrosMap.get(nombreGrupo)!.lineas;
      lineasMap.set(linea.nombre, (lineasMap.get(linea.nombre) || 0) + 1);
    });

    this.filtrosLaterales = Array.from(filtrosMap.values()).map(f => ({
      nombre: f.nombre,
      logoUrl: f.logoUrl,
      lineas: Array.from(f.lineas.entries()).map(([nombre, cantidad]) => ({ nombre, cantidad }))
    }));
  }

  filtrarMarcaDesdeFranquicia(nombre: string) {
    this.marcaSeleccionada = this.marcaSeleccionada === nombre ? null : nombre;
    this.lineaSeleccionada = null;
    this.guardarEnStorage({
      filtroMarca: this.marcaSeleccionada,
      filtroLinea: null
    });
    this.actualizarFiltrosLaterales();
    this.actualizarQueryParams();
  }

  filtrarFranquiciaDesdeMarca(nombre: string) {
    this.franquiciaSeleccionada = this.franquiciaSeleccionada === nombre ? null : nombre;
    this.lineaSeleccionada = null;
    this.guardarEnStorage({
      filtroFranquicia: this.franquiciaSeleccionada,
      filtroLinea: null
    });
    this.actualizarFiltrosLaterales();
    this.actualizarQueryParams();
  }

  restaurarFiltrosDesdeLocalStorage() {
    if (!this.esBrowser()) return;

    const tipo = localStorage.getItem('filtroTipo') as 'franquicia' | 'marca' | null;
    const franquicia = localStorage.getItem('filtroFranquicia');
    const marca = localStorage.getItem('filtroMarca');
    const linea = localStorage.getItem('filtroLinea');

    if (tipo === 'franquicia' && franquicia) {
      this.opcionSeleccionada = tipo;
      this.franquiciaSeleccionada = franquicia;
      this.productos = this.productos.filter(p => p.franquicia?.nombre === franquicia);
    } else if (tipo === 'marca' && marca) {
      this.opcionSeleccionada = tipo;
      this.marcaSeleccionada = marca;
      this.productos = this.productos.filter(p => p.marca?.nombre === marca);
    }

    if (linea) this.lineaSeleccionada = linea;
    this.actualizarFiltrosLaterales();
    this.actualizarQueryParams();
  }

  limpiarTodosLosFiltros() {
    this.resetearFiltros();
    this.opcionSeleccionada = 'franquicia';
    this.guardarEnStorage({ filtroTipo: 'franquicia' });
    this.cargarProductos();
    this.actualizarQueryParams();
  }

  @ViewChild('slider', { static: false }) slider?: ElementRef;

  moverSlider(direccion: number) {
    if (this.slider) {
      this.slider.nativeElement.scrollLeft += direccion * 200;
    }
  }
  private routeTo(queryParams: any) {
  if (isPlatformBrowser(this.platformId)) {
    history.replaceState(null, '', `/catalogo?${new URLSearchParams(queryParams).toString()}`);
  }
}

}
