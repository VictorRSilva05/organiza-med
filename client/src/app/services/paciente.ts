// Em: src/app/services/paciente.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Paciente } from '../models/paciente'; // Importe a interface
import { mapearRespostaApi } from '../util/mapear-resposta-api';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private baseUrl = 'https://localhost:7043/api/pacientes';

  constructor(private http: HttpClient) {}

  public getPacientes(): Observable<Paciente[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(mapearRespostaApi<ListarPacientesApiResponseModel>),
      map((res) => res.registros) // Retorna apenas os registros
    );
  }

  public getPacienteById(id: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseUrl}/${id}`);
  }

  public createPaciente(paciente: Omit<Paciente, 'id' | 'atividades'>): Observable<Paciente> {
    return this.http.post<Paciente>(this.baseUrl, paciente);
  }

  public updatePaciente(id: string, paciente: Paciente): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, paciente);
  }

  public deletePaciente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export interface ListarPacientesApiResponseModel {
  quantidadeRegistros: number;
  registros: Paciente[];
}

export interface ListarPacientesModel {
  id: string;
  nome: string;
  cpf: string;
  email: string;
}
