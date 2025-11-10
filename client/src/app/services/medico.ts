import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medico } from '../models/medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private baseUrl = 'https://localhost:7043/api/medicos';

  constructor(private http: HttpClient) { }

  public getMedicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.baseUrl);
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
