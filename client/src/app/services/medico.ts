import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Medico } from '../models/medico';
import { HttpHeaders } from '@angular/common/http';
import { mapearRespostaApi } from '../util/mapear-resposta-api';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private baseUrl = 'https://localhost:7043/api/medicos';

  constructor(private http: HttpClient) { }

  public getMedicos(): Observable<Medico[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(mapearRespostaApi<ListarMedicosApiResponseModel>),
      map((res) => res.registros));
  }

  public getMedicoById(id: string): Observable<Medico> {
    return this.http.get<Medico>(`${this.baseUrl}/${id}`);
  }

  public createMedico(medico: Omit<Medico, 'id'>): Observable<Medico> {
    return this.http.post<Medico>(this.baseUrl, medico);
  }

  public updateMedico(id: string, medico: Medico): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, medico);
  }

  public deleteMedico(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  public getTop10Medicos(inicio: Date, termino: Date): Observable<Medico[]> {
    let params = new HttpParams()
      .set('inicio', inicio.toISOString())
      .set('termino', termino.toISOString());

    return this.http.get<Medico[]>(`${this.baseUrl}/top-10`, { params });
  }
}

export interface ListarMedicosApiResponseModel {
  quantidadeRegistros: number;
  registros: Medico[];
}

export interface ListarMedicosModel {
  id: string;
  nome: string;
  crm: string;
}
