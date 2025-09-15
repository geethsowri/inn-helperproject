import { Component, OnInit, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { FormTrackerComponent } from './form-tracker/form-tracker.component';
import { HelperformPage1Component } from './helperform-page1/helperform-page1.component';
import { HelperformPage2Component } from './helperform-page2/helperform-page2.component';
import { HelperformPage3Component } from './helperform-page3/helperform-page3.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceService } from '../services/service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import * as XLSX from 'xlsx';
import { take, firstValueFrom } from 'rxjs';
import { IdCardComponent } from '../id-card/id-card.component';


@Component({
  selector: 'app-helperform',
  standalone: true,
  imports: [
    FormTrackerComponent,
    HelperformPage1Component,
    HelperformPage2Component,
    HelperformPage3Component,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './helperform.component.html',
  styleUrls: ['./helperform.component.scss']
})
export class HelperformComponent implements OnInit {

  category = signal(1);
  data: any = [];
  currenthelper: any;
  random: string;
  get_helpers: any;
  dup: number = 0;
  selectedProfileFile: File | null = null;
  selectedKycFile: File | null = null;
  profilePreviewUrl: string | null = null;

  private dialog = inject(MatDialog);

  pageChanged(num: number): void {
    this.category.set(num);
  }

  onProfilePreviewGenerated(preview: string) {
    this.profilePreviewUrl = preview;
  }

  onProfileFileSelected(file: File) {
    console.log('Profile file selected:', file);
    this.selectedProfileFile = file;
    this.helperForm.patchValue({ profile: file });
    console.log('Form value after patch:', this.helperForm.value);
    const reader = new FileReader();
    reader.onload = () => {
      this.profilePreviewUrl = reader.result as string
    };
    reader.readAsDataURL(file);
  }

  onKycFileSelected(file: File) {
    this.selectedKycFile = file;
    this.helperForm.patchValue({ kycDocument: file });
  }

  helperForm!: FormGroup;

  constructor(private fb: FormBuilder, private service: ServiceService, private router: Router) { }

  ngOnInit(): void {
    this.helperForm = this.fb.group({
      profile: [null],
      serviceType: ['', Validators.required],
      organization: ['', Validators.required],
      fullName: ['', Validators.required],
      languages: ['', Validators.required],
      gender: ['', Validators.required],
      phonePrefix: ['+91'],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      vehicleType: ['None'],
      kycDocument: [null]
    });

    this.service.helperFunctionCall$.pipe(take(1)).subscribe((event) => {
      this.onFileChange(event);
      this.service.clearHelperFunctionTrigger();
    });


  }

  onProfileSelected(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.profilePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


  submitHelperForm() {
    console.log('Form valid:', this.helperForm.valid);
    console.log('Form value:', this.helperForm.value);
    console.log('Selected profile file:', this.selectedProfileFile);
    console.log('Selected KYC file:', this.selectedKycFile);

    if (this.helperForm.valid) {
      const formData = this.helperForm.value;
      const fields = [];

      for (let key in formData) {
        if (formData.hasOwnProperty(key)) {
          if (Array.isArray(formData[key])) {
            fields.push({ name: key, values: formData[key] });
          } else if (key === 'profile' && formData[key] instanceof File) {
            // Handle file upload separately
            fields.push({ name: key, value: 'file_upload_pending' });
          } else {
            fields.push({ name: key, value: formData[key] });
          }
        }
      }

      // Ensure profile field is always included
      if (!fields.find(f => f.name === 'profile')) {
        fields.push({ name: 'profile', value: null });
      }

      console.log('Fields array before upload:', fields);

      this.service.get_empId().subscribe(emp_id => {
        const payload = {
          emp_id: emp_id,
          fields: fields
        };

        this.currenthelper = payload;

        // Handle file uploads if any files are selected
        const uploadPromises = [];

        if (this.selectedProfileFile) {
          console.log('Uploading profile file:', this.selectedProfileFile);
          uploadPromises.push(firstValueFrom(this.service.uploadProfilePicture(this.selectedProfileFile)));
        } else {
          console.log('No profile file selected');
        }

        if (this.selectedKycFile) {
          console.log('Uploading KYC file:', this.selectedKycFile);
          uploadPromises.push(firstValueFrom(this.service.uploadKycDocument(this.selectedKycFile)));
        }

        if (uploadPromises.length > 0) {
          Promise.all(uploadPromises).then(uploadResponses => {
            console.log('Upload responses:', uploadResponses);
            // Update fields with uploaded file paths
            uploadResponses.forEach((uploadResponse, index) => {
              if (uploadResponse) {
                const fieldName = index === 0 && this.selectedProfileFile ? 'profile' : 'kycDocument';
                const fieldIndex = payload.fields.findIndex(field => field.name === fieldName);
                console.log(`Updating field ${fieldName} at index ${fieldIndex} with value:`, uploadResponse.filePath || uploadResponse.fileName);
                if (fieldIndex !== -1) {
                  payload.fields[fieldIndex].value = uploadResponse.filePath || uploadResponse.fileName;
                }
              }
            });
            console.log('Final payload before submission:', payload);

            this.service.addHelper(payload).subscribe(res => {
              const dialogRef = this.dialog.open(DialogComponent, {
                data: {
                  ...this.currenthelper,
                  deletion: 1,
                },
                height: '400px',
                width: '550px'
              });

              dialogRef.afterClosed().subscribe(() => {
                this.router.navigate(['/helpers']);
              });
            });
          }).catch(error => {
            console.error('Error uploading files:', error);
            // Still proceed with form submission even if file upload fails
            this.service.addHelper(payload).subscribe(res => {
              const dialogRef = this.dialog.open(DialogComponent, {
                data: {
                  ...this.currenthelper,
                  deletion: 1,
                },
                height: '400px',
                width: '550px'
              });

              dialogRef.afterClosed().subscribe(() => {
                this.router.navigate(['/helpers']);
              });
            });
          });
        } else {
          // No files to upload, proceed directly
          this.service.addHelper(payload).subscribe(res => {
            const dialogRef = this.dialog.open(DialogComponent, {
              data: {
                ...this.currenthelper,
                deletion: 1,
              },
              height: '400px',
              width: '550px'
            });

            dialogRef.afterClosed().subscribe(() => {
              this.router.navigate(['/helpers']);
            });
          });
        }
      });

    } else {
      console.warn("Form is invalid");
    }
  }

  onFileChange(event: any) {
    this.dup = 0;
    const file = event.target.files[0];
    if (!file) return;

    this.service.display().subscribe((res) => {
      this.get_helpers = res;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headings: any = jsonData[0];

        const totalRows = jsonData.length - 1;
        let completedRequests = 0;
        let rowsToInsertOrUpdate = 0;

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          const fields: any[] = [];
          const plainObj: any = {};

          fields.push({ name: 'profile', value: null });

          for (let j = 0; j < headings.length; j++) {
            const key = headings[j];
            let value = row[j];

            if (key === 'languages' && typeof value === 'string') {
              try {
                value = JSON.parse(value);
                fields.push({ name: key, values: value });
                plainObj[key] = value;
              } catch (e) {
                console.warn(`Error parsing languages: ${e}`);
              }
            } else {
              fields.push({ name: key, value: value });
              plainObj[key] = value;
            }
          }

          fields.push({ name: 'kycDocument', value: null });

          const existingHelper = this.get_helpers.find(helper => {
            const getValue = (fieldName: string) =>
              helper.fields.find(h => h.name === fieldName)?.value;

            return (
              getValue('fullName') === plainObj['fullName'] &&
              getValue('phone') === plainObj['phone'] &&
              getValue('email') === plainObj['email']
            );
          });

          rowsToInsertOrUpdate++;

          if (existingHelper) {
            const helperId = existingHelper._id;
            this.service.updateHelper(helperId, fields).subscribe(() => {
              completedRequests++;
              if (completedRequests === rowsToInsertOrUpdate) {
                this.openDialogAndRedirect();
              }
            });
          } else {
            this.service.get_empId().subscribe(emp_id => {
              const payload = { emp_id, fields };

              this.service.addHelper(payload).subscribe(() => {
                completedRequests++;
                if (completedRequests === rowsToInsertOrUpdate) {
                  this.openDialogAndRedirect();
                }
              });
            });
          }
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }


  openDialogAndRedirect() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        deletion: 2,
        duplicates: this.dup
      },
      height: '400px',
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/helpers']);
    });
  }
}
