import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Medico } from '../../models/medico';
import { MedicoService } from '../../services/medico';
import { NotificationService } from '../../services/notification';
import { MedicoFormDialogComponent } from '../medico-form-dialog/medico-form-dialog';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [
    CommonModule,

    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,

    MatDialogModule
  ],
  templateUrl: './medicos.html',
  styleUrls: ['./medicos.scss']
})
export class MedicosComponent implements OnInit {

  private medicoService = inject(MedicoService);
  private notificationService = inject(NotificationService);

  private dialog = inject(MatDialog);

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


  novoMedico(): void {
    const dialogRef = this.dialog.open(MedicoFormDialogComponent, {
      width: '450px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.medicoService.createMedico(result).subscribe({
          next: () => {
            this.notificationService.showSuccess('Médico criado com sucesso!');
            this.carregarMedicos();
          },
          error: (err) => {
            this.notificationService.showError('Falha ao criar médico.');
            console.error(err);
          }
        });
      }
    });
  }

  editarMedico(medico: Medico): void {
    const dialogRef = this.dialog.open(MedicoFormDialogComponent, {
      width: '450px',
      disableClose: true,
      data: { medico: medico }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const medicoAtualizado = { ...medico, ...result };

        this.medicoService.updateMedico(medico.id, medicoAtualizado).subscribe({
          next: () => {
            this.notificationService.showSuccess('Médico atualizado com sucesso!');
            this.carregarMedicos();
          },
          error: (err) => {
            this.notificationService.showError('Falha ao atualizar médico.');
            console.error(err);
          }
        });
      }
    });
  }

  excluirMedico(medico: Medico): void {
    const confirmar = window.confirm(`Deseja realmente excluir o médico ${medico.nome}?`);

    if (confirmar) {
      this.medicoService.deleteMedico(medico.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Médico excluído com sucesso.');
          this.carregarMedicos();
        },
        error: (err) => {
          this.notificationService.showError('Falha ao excluir médico.');
          console.error(err);
        }
      });
    }
  }
}
