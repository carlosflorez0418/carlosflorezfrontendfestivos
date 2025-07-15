import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Festivo } from '../shared/entidades/festivo';

@Injectable({
  providedIn: 'root'
})
export class FestivosService {
  private baseUrl = 'http://localhost:8081/api/festivos';

  constructor(private http: HttpClient) { }

  getFestivosPorAnio(anio: number): Observable<Festivo[]> {
    return this.http.get<Festivo[]>(`${this.baseUrl}/listar/${anio}`);
  }

  verificarFestivo(anio: number, mes: number, dia: number): Observable<string> {
    return this.http.get(`${this.baseUrl}/verificar/${anio}/${mes}/${dia}`, { responseType: 'text' });
  }
}