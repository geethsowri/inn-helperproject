import { Component, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent } from '../../radio-button/radio-button.component';
import { SelectDropdownComponent } from '../../select-dropdown/select-dropdown.component';
import { CheckboxComponent } from '../../checkbox/checkbox.component';
import { HelperformPage2Component } from '../helperform-page2/helperform-page2.component';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

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
  styleUrl: './helperform-page1.component.scss'
})

export class HelperformPage1Component {

  pattern: string = '[0-9]{10}';
  vehicle: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  fileUpload() {
    this.fileInput.nativeElement.click();
  }

  @ViewChild('kycfileInput') kycfileInput!: ElementRef<HTMLInputElement>;
  kycfileUpload() {
    this.kycfileInput.nativeElement.click();
  }

  @Output() changePage = new EventEmitter<number>();
  @Output() profileFileSelected = new EventEmitter<File>();
  @Output() kycFileSelected = new EventEmitter<File>();
  @Output() profilePreviewGenerated = new EventEmitter<string>();

  onProfileFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Emit the raw file for backend
      this.profileFileSelected.emit(file);
  
      // Generate a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePreviewGenerated.emit(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }


  onKycFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.kycFileSelected.emit(file);
    }
  }

  onPageChange() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.changePage.emit(2);
  }

  getValue() {
    console.log(this.form.get('serviceType').value);
  }

  @Input() form!: FormGroup;

  ngOnInit() {
    this.form.get('serviceType')!.valueChanges.subscribe(() => {
      const control = this.form.get('serviceType');
      setTimeout(() => {
        if (control?.touched) {
          if (control.value == 'Driver') {
            this.vehicle = true;
          }
        }
      });
    });
  }
}