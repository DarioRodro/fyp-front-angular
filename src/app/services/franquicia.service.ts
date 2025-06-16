import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Franquicia } from '../models/producto.model'; // usa tu modelo unificado

@Injectable({
  providedIn: 'root'
})
export class FranquiciaService {
  private apiUrl = 'http://localhost:1337/api/franquicias?populate=logo';

  constructor(private http: HttpClient) {}

  obtenerFranquicias(): Observable<{ data: Franquicia[] }> {
    return this.http.get<{ data: Franquicia[] }>(this.apiUrl);
  }
}
