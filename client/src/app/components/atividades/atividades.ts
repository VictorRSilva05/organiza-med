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
import { AtividadeMedica, TipoAtividade } from '../../models/atividade-medica';
import { AtividadeMedicaService } from '../../services/atividade-medica';
import { NotificationService } from '../../services/notification';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './atividades.html',
  styleUrls: ['./atividades.scss'],
})
export class AtividadesComponent implements OnInit {
  private atividadeService = inject(AtividadeMedicaService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);

  public atividades$!: Observable<AtividadeMedica[]>;

  public displayedColumns: string[] = ['inicio', 'termino', 'tipo', 'paciente', 'medicos', 'acoes'];

  public filtroTipo: TipoAtividade | 'Todas' = 'Todas';

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
      },
    });
  }

  onFiltroChange(): void {
    this.carregarAtividades();
  }

  formatarMedicos(medicos: any[]): string {
    if (!medicos || medicos.length === 0) return 'N/A';
    return medicos.map((m) => m.nome).join(', ');
  }

  novaAtividade(): void {
 const dialogRef = this.dialog.open(AtividadeFormDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      // 'result' vem do formulário: { ..., pacienteId, medicoIds }
      if (result) {

        // ---- INÍCIO DA CORREÇÃO ----

        const medicoIds = result.medicoIds;

        // 1. Garante que 'medicos' seja SEMPRE um array
        const medicosParaApi = Array.isArray(medicoIds) ? medicoIds : [medicoIds];

        // 2. Monta o DTO "plano" (exatamente como o JSON que você enviou)
        const atividadeDto = {
          inicio: result.inicio,
          termino: result.termino,
          tipoAtividade: result.tipoAtividade,
          pacienteId: result.pacienteId,
          medicos: medicosParaApi
        };
        // ---- FIM DA CORREÇÃO ----

        // Envia o DTO plano
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

  editarAtividade(atividade: AtividadeMedica): void {
    const dialogRef = this.dialog.open(AtividadeFormDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { atividade: atividade }, // Envia a atividade
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.atividadeService.updateAtividade(atividade.id, result).subscribe({
          next: () => {
            this.notificationService.showSuccess('Atividade atualizada com sucesso!');
            this.carregarAtividades();
          },
          error: (err) => {
            this.notificationService.showError('Falha ao atualizar atividade.');
            console.error(err);
          },
        });
      }
    });
  }
  excluirAtividade(atividade: AtividadeMedica): void {
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
        },
      });
    }
  }
}
