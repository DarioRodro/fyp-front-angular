import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model'; // NUEVA RUTA

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
private apiUrl = 'http://localhost:1337/api/products?populate[Imagen]=true&populate[franquicia][populate][0]=logo&populate[marca][populate][0]=logo&populate[linea][populate][0]=marca&populate[linea][populate][1]=franquicias&populate[linea][populate][2]=marca.logo&populate[categories]=*';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<{ data: Producto[] }> {
    return this.http.get<{ data: Producto[] }>(this.apiUrl);  
  }
}
