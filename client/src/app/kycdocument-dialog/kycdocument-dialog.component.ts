import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface IKycDocumentDetails {
  documentType: string;
  fileName: string;
  base64: string;
  fileSize: number;
}

@Component({
  selector: 'app-kycdocument-dialog',
  templateUrl: './kycdocument-dialog.component.html',
  styleUrls: ['./kycdocument-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class KycdocumentDialogComponent {
  form: FormGroup;
  filePreview: string | null = null;
  uploadedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<KycdocumentDialogComponent>
  ) {
    this.form = this.fb.group({
      documentType: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result as string;
      };
      reader.readAsDataURL(this.uploadedFile);

      this.form.patchValue({ file: this.uploadedFile });
    }
  }

  submit() {
    if (this.form.invalid || !this.uploadedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const details: IKycDocumentDetails = {
        documentType: this.form.get('documentType')?.value,
        fileName: this.uploadedFile!.name,
        base64: reader.result as string,
        fileSize: this.uploadedFile!.size
      };
      this.dialogRef.close(details);
    };
    reader.readAsDataURL(this.uploadedFile);
  }

  cancel() {
    this.dialogRef.close();
  }
}
