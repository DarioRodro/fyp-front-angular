import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Franquicia } from '../models/producto.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FranquiciaService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerFranquicias(): Observable<{ data: Franquicia[] }> {
    const url = `${this.baseUrl}/franquicias?populate=logo`;
    return this.http.get<{ data: Franquicia[] }>(url);
  }
}
