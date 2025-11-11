// Em: src/app/components/paciente-form-dialog/paciente-form-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Imports do Material Dialog
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

// Imports dos campos do formulário
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Paciente } from '../../models/paciente';

@Component({
  selector: 'app-paciente-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './paciente-form-dialog.html',
  styleUrls: ['./paciente-form-dialog.scss']
})
export class PacienteFormDialogComponent implements OnInit {

  pacienteForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PacienteFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { paciente?: Paciente }
  ) {
    this.isEditMode = !!this.data?.paciente;

    this.pacienteForm = this.fb.group({
      nome: ['', [Validators.required]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]], // 11 dígitos
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.paciente) {
      this.pacienteForm.patchValue(this.data.paciente);
    }
  }

  onSave(): void {
    if (this.pacienteForm.invalid) {
      this.pacienteForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.pacienteForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
