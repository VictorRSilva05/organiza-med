import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AtividadeMedica, TipoAtividade } from '../../models/atividade-medica';
import { Medico } from '../../models/medico';
import { Paciente } from '../../models/paciente';
import { MedicoService } from '../../services/medico';
import { PacienteService } from '../../services/paciente';

@Component({
  selector: 'app-atividade-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './atividade-form-dialog.html',
  styleUrls: ['./atividade-form-dialog.scss']
})
export class AtividadeFormDialogComponent implements OnInit {

  atividadeForm: FormGroup;
  isEditMode: boolean = false;

  medicos$!: Observable<Medico[]>;
  pacientes$!: Observable<Paciente[]>;

  private medicoService = inject(MedicoService);
  private pacienteService = inject(PacienteService);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AtividadeFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { atividade?: AtividadeMedica }
  ) {
    this.isEditMode = !!this.data?.atividade;

    this.atividadeForm = this.fb.group({
      inicio: [new Date(), [Validators.required]],
      termino: [new Date(), [Validators.required]],
      tipoAtividade: ['Consulta' as TipoAtividade, [Validators.required]],

      pacienteId: [null, [Validators.required]],
      medicoIds: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {
   this.carregarDropdowns();

  if (this.isEditMode) {

      setTimeout(() => {
        // Pegamos a atividade AQUI, usando o '?' (optional chaining)
        const atividade = this.data?.atividade;

        // Verificamos se 'atividade' realmente existe AQUI
        if (atividade) {
          this.atividadeForm.patchValue({
            inicio: atividade.inicio,
            termino: atividade.termino,
            tipoAtividade: atividade.tipoAtividade,
            pacienteId: atividade.paciente.id,
            medicoIds: atividade.medicos.map(m => m.id)
          });

          // Desabilita o campo de paciente (conforme PDF)
          this.atividadeForm.get('pacienteId')?.disable();
        }
      }, 0); // O '0' é o suficiente
    }
  }

  carregarDropdowns(): void {
    this.medicos$ = this.medicoService.getMedicos();
    this.pacientes$ = this.pacienteService.getPacientes();
  }

  isMultiploMedicos(): boolean {
    return this.atividadeForm.get('tipoAtividade')?.value === 'Cirurgia';
  }

  onSave(): void {
    if (this.atividadeForm.invalid) {
      this.atividadeForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.atividadeForm.getRawValue());
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
