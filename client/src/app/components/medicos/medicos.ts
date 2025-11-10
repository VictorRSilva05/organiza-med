import { Component, OnInit, inject } from '@angular/core'; // Adicione OnInit
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Medico } from '../../models/medico';
import { MedicoService } from '../../services/medico';
import { NotificationService } from '../../services/notification';


@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [
    CommonModule,

    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './medicos.html',
  styleUrls: ['./medicos.scss']
})
export class MedicosComponent implements OnInit {

  private medicoService = inject(MedicoService);
  private notificationService = inject(NotificationService);

  public medicos$!: Observable<Medico[]>;
  public displayedColumns: string[] = ['nome', 'crm', 'acoes'];

  ngOnInit(): void {
    this.carregarMedicos();
  }

  carregarMedicos(): void {
    this.medicos$ = this.medicoService.getMedicos();

    this.medicos$.subscribe({
      error: (err) => {
        this.notificationService.showError('Falha ao carregar médicos.');
        console.error(err);
      }
    });
  }

  editarMedico(medico: Medico): void {
    this.notificationService.showError('Função "Editar" ainda não implementada.');
  }

  excluirMedico(medico: Medico): void {
    this.notificationService.showError('Função "Excluir" ainda não implementada.');
  }

  novoMedico(): void {
    this.notificationService.showError('Função "Novo Médico" ainda não implementada.');
  }
}
