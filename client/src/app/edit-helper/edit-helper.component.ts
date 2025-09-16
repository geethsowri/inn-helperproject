import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../services/service.service';
import { RadioButtonComponent } from '../radio-button/radio-button.component';
import { SelectDropdownComponent } from '../select-dropdown/select-dropdown.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-helper',
  standalone: true,
  imports: [
    CommonModule,
    RadioButtonComponent,
    SelectDropdownComponent,
    CheckboxComponent,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-helper.component.html',
  styleUrl: './edit-helper.component.scss'
})
export class EditHelperComponent {
  form!: FormGroup;
  helperId!: string;
  data: any = [];
  profilePreviewUrl: string | null = null;
  onProfileFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: ServiceService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.helperId = this.route.snapshot.paramMap.get('id')!;

    this.form = this.fb.group({
      profile: [null],
      serviceType: ['', Validators.required],
      organization: ['', Validators.required],
      fullName: ['', Validators.required],
      languages: [[], Validators.required],
      gender: ['', Validators.required],
      phonePrefix: ['+91', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      vehicleType: ['None']
    });

    this.service.getHelperById(this.helperId).subscribe((data: any) => {
      const patchData: any = {};

      data.fields.forEach((field: any) => {
        if (field.value) {
          patchData[field.name] = field.value;
        }
        else if (field.values) {
          patchData[field.name] = field.values;
        }
      });

      this.form.patchValue(patchData);
      // this.profilePreviewUrl = patchData.profile || null;
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      for (let key in formData) {
        if (formData.hasOwnProperty(key)) {
          if (Array.isArray(formData[key])) {
            this.data.push({ name: key, values: formData[key] });
          }
          else {
            this.data.push({ name: key, value: formData[key] });
          }
        }
      }
      this.service.updateHelper(this.helperId, this.data).subscribe(() => {
        this.snackBar.open('Helper updated successfully!', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        });

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/helpers']);
        });
      });
    }
    else {
      console.log('invalid')
    }
  }
}
