// Em: src/app/components/atividades/atividades.component.ts

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
import { FormsModule } from '@angular/forms'; // Para usar o ngModel
import { AtividadeMedica, TipoAtividade } from '../../models/atividade-medica';
import { AtividadeMedicaService } from '../../services/atividade-medica';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-atividades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Importe
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule, // Importe
    MatSelectModule     // Importe
  ],
  templateUrl: './atividades.html',
  styleUrls: ['./atividades.scss'] // (Reutilizar CSS)
})
export class AtividadesComponent implements OnInit {

  private atividadeService = inject(AtividadeMedicaService);
  private notificationService = inject(NotificationService);

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
      }
    });
  }

  onFiltroChange(): void {
    this.carregarAtividades();
  }

  formatarMedicos(medicos: any[]): string {
    if (!medicos || medicos.length === 0) return 'N/A';
    return medicos.map(m => m.nome).join(', ');
  }

  novaAtividade(): void {
    this.notificationService.showError('Função "Nova Atividade" ainda não implementada.');
  }
  editarAtividade(atividade: AtividadeMedica): void {
    this.notificationService.showError('Função "Editar" ainda não implementada.');
  }
  excluirAtividade(atividade: AtividadeMedica): void {
    this.notificationService.showError('Função "Excluir" ainda não implementada.');
  }
}
