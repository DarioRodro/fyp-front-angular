import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private apiUrl = 'http://localhost:1337/api/marcas?populate=logo';

  constructor(private http: HttpClient) {}

  obtenerMarcas(): Observable<{ data: Marca[] }> {
    return this.http.get<{ data: Marca[] }>(this.apiUrl);
  }
}
