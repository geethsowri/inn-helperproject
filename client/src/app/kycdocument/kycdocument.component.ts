import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-kycdocument',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './kycdocument.component.html',
  styleUrls: ['./kycdocument.component.scss'],
})
export class KycdocumentComponent {
  kycForm!: FormGroup;
  kycDocumentForm: FormGroup;
  pdfData = '';
  isDragging = false;

  @Input() name!: string;

  documentTypeOptions = [
    { label: 'Aadhar Card', value: 'Aadhar Card' },
    { label: 'PAN Card', value: 'PAN Card' },
    { label: 'Passport', value: 'Passport' },
    { label: 'Voter ID', value: 'Voter ID' },
  ];

  kycDocumentDetails: IkycDocumentDetails = {
    documentType: '',
    fileName: '',
    base64: '',
    fileSize: 0,
  };

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<KycdocumentComponent>
  ) {
    this.kycForm = this.fb.group({
      name: ['', Validators.required],
      idType: ['', Validators.required],
      idNumber: ['', Validators.required],
      pdfFileUrl: ['', Validators.required]
    });
    
    this.kycDocumentForm = this.fb.group({
      name: ['', Validators.required],
      idType: ['', Validators.required],
      idNumber: ['', Validators.required],
      pdfFileUrl: ['', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    this.isDragging = false;
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      this.kycDocumentDetails.fileSize = file.size;
      reader.onload = () => {
        const base64String = reader.result as string;
        this.kycForm.patchValue({ pdfFileUrl: base64String });
        this.kycDocumentForm.patchValue({ pdfFileUrl: base64String });
        this.pdfData = base64String.split(',')[1];
        this.kycDocumentDetails.base64 = base64String;
        this.kycDocumentDetails.fileName = file.name;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    } else {
      this.resetState();
      alert('Please upload a valid PDF file.');
    }
    input.value = '';
  }

  onSubmit() {
    if (this.kycForm.invalid) {
      this.kycForm.markAllAsTouched();
      return;
    }

    this.kycDocumentDetails.documentType = this.kycForm.get('idType')?.value;
    this.dialogRef.close(this.kycDocumentDetails);
  }

  saveThekycDocument(event: Event) {
    event.preventDefault();
    if (this.kycDocumentForm.invalid) {
      this.kycDocumentForm.markAllAsTouched();
      return;
    }

    this.kycDocumentDetails.documentType = this.kycDocumentForm.get('idType')?.value;
    this.dialogRef.close(this.kycDocumentDetails);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  clearThekycDocument(): void {
    this.resetState();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.kycForm.patchValue({ pdfFileUrl: base64String });
        this.kycDocumentForm.patchValue({ pdfFileUrl: base64String });
        this.pdfData = base64String.split(',')[1];
        this.kycDocumentDetails.base64 = base64String;
        this.kycDocumentDetails.fileName = file.name;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    } else {
      this.resetState();
      alert('Please upload a valid PDF file.');
    }
  }

  private resetState() {
    this.kycDocumentDetails = {
      documentType: '',
      fileName: '',
      base64: '',
      fileSize: 0,
    };
    this.pdfData = '';
    this.kycForm.patchValue({ pdfFileUrl: '', idType: '' });
    this.kycDocumentForm.patchValue({ pdfFileUrl: '', idType: '' });
  }
}

export default interface IkycDocumentDetails {
  documentType: string;
  fileName: string;
  base64: string;
  fileSize: number;
}