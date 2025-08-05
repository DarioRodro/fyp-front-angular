import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  
  obtenerProductosPaginados(
  page: number,
  pageSize: number = 12,
  filtros: { franquicia?: string; marca?: string; linea?: string } = {}
): Observable<any> {
  let url = `${this.baseUrl}/products?pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`;

  // Agrega filtros dinámicamente
  if (filtros.franquicia) {
    url += `&filters[franquicia][nombre][$eq]=${encodeURIComponent(filtros.franquicia)}`;
  }
  if (filtros.marca) {
    url += `&filters[marca][nombre][$eq]=${encodeURIComponent(filtros.marca)}`;
  }
  if (filtros.linea) {
    url += `&filters[linea][nombre][$eq]=${encodeURIComponent(filtros.linea)}`;
  }

  // Populates
  url += `&populate[Imagen]=true`;
  url += `&populate[franquicia][populate][0]=logo`;
  url += `&populate[marca][populate][0]=logo`;
  url += `&populate[linea][populate][0]=marca`;
  url += `&populate[linea][populate][1]=franquicias`;
  url += `&populate[linea][populate][2]=marca.logo`;
  url += `&populate[tags]=true`;
  url += `&populate[categories]=*`;

  return this.http.get<any>(url);
}

  obtenerProductoPorSlug(slug: string): Observable<{ data: Producto[] }> {
    const url = `${this.baseUrl}/products?filters[slug][$eq]=${slug}&populate[Imagen]=true&populate[franquicia][populate][0]=logo&populate[marca][populate][0]=logo&populate[linea][populate][0]=marca&populate[linea][populate][1]=franquicias&populate[linea][populate][2]=marca.logo&populate[tags]=true&populate[categories]=*`;
    return this.http.get<{ data: Producto[] }>(url);
  }

  obtenerProductosRelacionadosPorFranquicia(franquiciaId: number): Observable<{ data: Producto[] }> {
    const url = `${this.baseUrl}/products?filters[franquicia][id][$eq]=${franquiciaId}&populate[Imagen]=true&populate[franquicia][populate][0]=logo&populate[marca][populate][0]=logo&populate[linea][populate][0]=marca&populate[linea][populate][1]=franquicias&populate[linea][populate][2]=marca.logo&populate[tags]=true&populate[categories]=*`;
    return this.http.get<{ data: Producto[] }>(url);
  }

  buscarProductosPorTag(tag: string): Observable<{ data: Producto[] }> {
    const texto = tag.toLowerCase();
    const url = `${this.baseUrl}/products?filters[tags][nombre][$containsi]=${texto}&populate[tags]=true&populate[Imagen]=true`;
    return this.http.get<{ data: Producto[] }>(url);
  }
  obtenerTodosLosProductos(): Observable<any> {
  const url = `${this.baseUrl}/products?pagination[pageSize]=1000&populate[Imagen]=true&populate[franquicia][populate][0]=logo&populate[marca][populate][0]=logo&populate[linea][populate][0]=marca&populate[linea][populate][1]=franquicias&populate[linea][populate][2]=marca.logo&populate[tags]=true&populate[categories]=*`;
  return this.http.get<any>(url);
}

}
