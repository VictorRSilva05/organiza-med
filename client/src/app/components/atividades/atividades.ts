import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import {
  AtividadeMedicaService,
  ListarAtividadesMedicasModel
} from '../../services/atividade-medica';

import { TipoAtividadeMedicaEnum } from '../../services/atividade-medica';

import { NotificationService } from '../../services/notification';
import { AtividadeFormDialogComponent } from '../atividade-form-dialog/atividade-form-dialog';

@Component({
  selector: 'app-atividades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './atividades.html',
  styleUrls: ['./atividades.scss']
})
export class AtividadesComponent implements OnInit {

  private atividadeService = inject(AtividadeMedicaService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);

  public atividades$!: Observable<ListarAtividadesMedicasModel[]>;

  public displayedColumns: string[] = ['inicio', 'termino', 'tipo', 'paciente', 'medicos', 'acoes'];

  public filtroTipo: TipoAtividadeMedicaEnum | 'Todas' = 'Todas';

  ngOnInit(): void {
    this.carregarAtividades();
  }

  carregarAtividades(): void {
    const tipo = this.filtroTipo === 'Todas' ? undefined : this.filtroTipo;

    this.atividades$ = this.atividadeService.getAtividades(tipo);

    this.atividades$.subscribe({
      error: (err) => {
        this.notificationService.showError('Falha ao carregar atividades.');
        console.error(err);
      }
    });
  }

  formatarMedicos(medicos: any[]): string {
    if (!medicos || medicos.length === 0) return 'N/A';
    return medicos.map(m => m.nome).join(', ');
  }

  novaAtividade(): void {
    const dialogRef = this.dialog.open(AtividadeFormDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const medicoIds = result.medicoIds;
        const medicosParaApi = Array.isArray(medicoIds) ? medicoIds : [medicoIds];
        const atividadeDto = {
          inicio: result.inicio,
          termino: result.termino,
          tipoAtividade: result.tipoAtividade,
          pacienteId: result.pacienteId,
          medicos: medicosParaApi
        };

        this.atividadeService.createAtividade(atividadeDto).subscribe({
          next: () => {
            this.notificationService.showSuccess('Atividade criada com sucesso!');
            this.carregarAtividades();
          },
          error: (err) => {
            this.notificationService.showError('Falha ao criar atividade.');
            console.error(err);
          }
        });
      }
    });
  }

  editarAtividade(atividade: ListarAtividadesMedicasModel): void {

    const atividadeParaDialog = atividade as any;

    const dialogRef = this.dialog.open(AtividadeFormDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { atividade: atividadeParaDialog }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const medicoIds = result.medicoIds;
        const medicosParaApi = Array.isArray(medicoIds) ? medicoIds : [medicoIds];
        const atividadeDto = {
          inicio: result.inicio,
          termino: result.termino,
          tipoAtividade: result.tipoAtividade,
          pacienteId: result.pacienteId,
          medicos: medicosParaApi
        };

        this.atividadeService.updateAtividade(atividade.id, atividadeDto).subscribe({
          next: () => {
            this.notificationService.showSuccess('Atividade atualizada com sucesso!');
            this.carregarAtividades();
          },
          error: (err) => {
            this.notificationService.showError('Falha ao atualizar atividade.');
            console.error(err);
          }
        });
      }
    });
  }

  excluirAtividade(atividade: ListarAtividadesMedicasModel): void {
    const confirmar = window.confirm(`Deseja realmente excluir a atividade?`);

    if (confirmar) {
      this.atividadeService.deleteAtividade(atividade.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Atividade excluída com sucesso.');
          this.carregarAtividades();
        },
        error: (err) => {
          this.notificationService.showError('Falha ao excluir atividade.');
          console.error(err);
        }
      });
    }
  }
}
