import { Component, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent } from '../../radio-button/radio-button.component';
import { SelectDropdownComponent } from '../../select-dropdown/select-dropdown.component';
import { CheckboxComponent } from '../../checkbox/checkbox.component';
import { HelperformPage2Component } from '../helperform-page2/helperform-page2.component';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import IkycDocumentDetails from '../../kycdocument/kycdocument.component';
import { MatDialog } from '@angular/material/dialog';
import { KycdocumentDialogComponent } from '../../kycdocument-dialog/kycdocument-dialog.component';

@Component({
  selector: 'app-helperform-page1',
  standalone: true,
  imports: [
    CommonModule,
    RadioButtonComponent,
    SelectDropdownComponent,
    CheckboxComponent,
    HelperformPage2Component,
    ReactiveFormsModule
  ],
  templateUrl: './helperform-page1.component.html',
  styleUrls: ['./helperform-page1.component.scss']
})
export class HelperformPage1Component {
  @Input() form!: FormGroup;
  profilePreview: string | null = null;
  vehicle: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() changePage = new EventEmitter<number>();
  @Output() profileFileSelected = new EventEmitter<File>();
  @Output() profilePreviewGenerated = new EventEmitter<string>();
  @Output() kycFileSelected = new EventEmitter<File>();

  constructor(private dialog: MatDialog) {}

  openKycDialog() {
    const dialogRef = this.dialog.open(KycdocumentDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((result: IkycDocumentDetails | undefined) => {
      if (result) {
        console.log('KYC Details:', result);
        this.kycFileSelected.emit(result as any); // emit to parent
        this.form.get('kycDocument')?.setValue(result);
      }
    });
  }

  fileUpload() {
    this.fileInput.nativeElement.click();
  }

  onProfileFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileFileSelected.emit(file);
      const reader = new FileReader();
      reader.onload = () => this.profilePreviewGenerated.emit(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onPageChange() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.changePage.emit(2);
  }

  ngOnInit() {
    this.form.get('serviceType')?.valueChanges.subscribe((val) => {
      this.vehicle = val === 'Driver';
    });
  }
}
