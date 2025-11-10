import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Paciente } from '../../models/paciente';
import { NotificationService } from '../../services/notification';
import { PacienteService } from '../../services/paciente';


@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    CommonModule,

    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pacientes.html',
  styleUrls: ['./pacientes.scss'] // Podemos reutilizar o CSS dos médicos
})
export class PacientesComponent implements OnInit {

  private pacienteService = inject(PacienteService);
  private notificationService = inject(NotificationService);

  public pacientes$!: Observable<Paciente[]>;

  public displayedColumns: string[] = ['nome', 'cpf', 'email', 'acoes'];

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.pacientes$ = this.pacienteService.getPacientes();

    this.pacientes$.subscribe({
      error: (err) => {
        this.notificationService.showError('Falha ao carregar pacientes.');
        console.error(err);
      }
    });
  }

  editarPaciente(paciente: Paciente): void {
    this.notificationService.showError('Função "Editar" ainda não implementada.');
  }

  excluirPaciente(paciente: Paciente): void {
    this.notificationService.showError('Função "Excluir" ainda não implementada.');
  }

  novoPaciente(): void {
    this.notificationService.showError('Função "Novo Paciente" ainda não implementada.');
  }
}
