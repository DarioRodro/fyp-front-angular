import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/producto.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerMarcas(): Observable<{ data: Marca[] }> {
    const url = `${this.baseUrl}/marcas?populate=logo`;
    return this.http.get<{ data: Marca[] }>(url);
  }
}
