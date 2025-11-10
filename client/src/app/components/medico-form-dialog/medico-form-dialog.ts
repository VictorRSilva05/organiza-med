import { Component, Inject, OnInit } from '@angular/core'; // Adicione Inject, OnInit
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Imports de Formulário
import { CommonModule } from '@angular/common';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog'; // Para o <mat-dialog-content>

import { Medico } from '../../models/medico';

@Component({
  selector: 'app-medico-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './medico-form-dialog.html',
  styleUrls: ['./medico-form-dialog.scss'],
})
export class MedicoFormDialogComponent implements OnInit {
  medicoForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MedicoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { medico?: Medico }
  ) {
    this.isEditMode = !!this.data?.medico;

    this.medicoForm = this.fb.group({
      nome: ['', [Validators.required]],
      crm: ['', [Validators.required, Validators.pattern(/^\d{5}-[A-Z]{2}$/)]],
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.medico) {
      this.medicoForm.patchValue(this.data.medico);
    }
  }

  onSave(): void {
    if (this.medicoForm.invalid) {
      this.medicoForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.medicoForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
