import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PacienteFormDialogComponent } from '../paciente-form-dialog/paciente-form-dialog';
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
    MatProgressSpinnerModule,

    MatDialogModule,
  ],
  templateUrl: './pacientes.html',
  styleUrls: ['./pacientes.scss'],
})
export class PacientesComponent implements OnInit {
  // Injeções
  private pacienteService = inject(PacienteService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog); // NOVO

  public pacientes$!: Observable<Paciente[]>;

  public displayedColumns: string[] = ['nome', 'cpf', 'email', 'telefone', 'acoes'];

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.pacientes$ = this.pacienteService.getPacientes();

    this.pacientes$.subscribe({
      error: (err) => {
        this.notificationService.showError('Falha ao carregar pacientes.');
        console.error(err);
      },
    });
  }

  novoPaciente(): void {
    const dialogRef = this.dialog.open(PacienteFormDialogComponent, {
      width: '450px',
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { id, atividades, ...novoPaciente } = result;

        novoPaciente.cpf = this.formatarCpfParaApi(novoPaciente.cpf);

        this.pacienteService.createPaciente(novoPaciente).subscribe({
          next: () => {
            this.notificationService.showSuccess('Paciente criado com sucesso!');
            this.carregarPacientes();
          },
          error: (err) => {
            this.notificationService.showError('Falha ao criar paciente.');
            console.error(err);
          },
        });
      }
    });
  }

  editarPaciente(paciente: Paciente): void {

    const dadosDialog = {
      ...paciente,
      cpf: this.removerFormatacaoCpf(paciente.cpf)
    };

    const dialogRef = this.dialog.open(PacienteFormDialogComponent, {
      width: '450px',
      disableClose: true,
      data: { paciente: dadosDialog },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const pacienteAtualizado = { ...paciente, ...result };

        pacienteAtualizado.cpf = this.formatarCpfParaApi(pacienteAtualizado.cpf);

        this.pacienteService.updatePaciente(paciente.id, pacienteAtualizado).subscribe({
          next: () => {
            this.notificationService.showSuccess('Paciente atualizado com sucesso!');
            this.carregarPacientes();
          },
          error: (err) => {
            this.notificationService.showError('Falha ao atualizar paciente.');
            console.error(err);
          },
        });
      }
    });
  }

  excluirPaciente(paciente: Paciente): void {
    const confirmar = window.confirm(`Deseja realmente excluir o paciente ${paciente.nome}?`);

    if (confirmar) {
      this.pacienteService.deletePaciente(paciente.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Paciente excluído com sucesso.');
          this.carregarPacientes();
        },
        error: (err) => {
          this.notificationService.showError('Falha ao excluir paciente.');
          console.error(err);
        },
      });
    }
  }

  private formatarCpfParaApi(cpf: string): string {
    if (!cpf || cpf.length !== 11) {
      return cpf; // Retorna o original se não for 11 dígitos
    }

    // Aplica a máscara 000.000.000-00
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private removerFormatacaoCpf(cpf: string): string {
    if (!cpf) {
      return '';
    }
    // Remove tudo que não for dígito
    return cpf.replace(/\D/g, '');
  }
}
