// Em: src/app/services/atividade-medica.service.ts

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoAtividade, AtividadeMedica } from '../models/atividade-medica';

@Injectable({
  providedIn: 'root'
})
export class AtividadeMedicaService {

  private baseUrl = 'https://localhost:7043/api/atividades-medicas';

  constructor(private http: HttpClient) { }

  public getAtividades(tipo?: TipoAtividade): Observable<AtividadeMedica[]> {
    let params = new HttpParams();
    if (tipo) {
      params = params.set('tipo', tipo);
    }

    return this.http.get<AtividadeMedica[]>(this.baseUrl, { params });
  }

  public getAtividadeById(id: string): Observable<AtividadeMedica> {
    return this.http.get<AtividadeMedica>(`${this.baseUrl}/${id}`);
  }

  public createAtividade(atividade: any): Observable<AtividadeMedica> {
    return this.http.post<AtividadeMedica>(this.baseUrl, atividade);
  }


  public updateAtividade(id: string, atividade: any): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, atividade);
  }

  public deleteAtividade(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
