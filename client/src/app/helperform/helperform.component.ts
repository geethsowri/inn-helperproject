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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


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

  // HelperformComponent.ts
  onProfileFileSelected(file: File, helperObj: any) {
    if (!file) return;

    this.selectedProfileFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      const previewUrl = reader.result as string;

      // Update form control
      this.helperForm.patchValue({ profile: previewUrl });

      // Update live preview for page3
      this.profilePreviewUrl = previewUrl;

      // Update helperObj.fields for helpers list
      if (!helperObj.fields) helperObj.fields = [];
      const existing = helperObj.fields.find(f => f.name === 'profile');
      if (existing) {
        existing.value = previewUrl;
      } else {
        helperObj.fields.push({ name: 'profile', value: previewUrl });
      }

      console.log('Fields array after upload:', helperObj.fields);
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

  submitHelperForm() {
    console.log('=== SUBMIT HELPER FORM CALLED ===');
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
        console.log('Generated emp_id:', emp_id);
        const payload = {
          emp_id: emp_id,
          fields: fields
        };

        console.log('Payload being sent to server:', JSON.stringify(payload, null, 2));
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
          uploadPromises.push(
            firstValueFrom(this.service.uploadKycDocument(this.selectedKycFile)).catch(error => {
              console.warn('KYC upload failed, continuing without KYC file:', error);
              return null; // Return null to indicate failed upload
            })
          );
        }

        if (uploadPromises.length > 0) {
          Promise.all(uploadPromises).then(uploadResponses => {
            console.log('Upload responses:', uploadResponses);
            // Update fields with uploaded file paths
            let responseIndex = 0;
            
            if (this.selectedProfileFile) {
              const uploadResponse = uploadResponses[responseIndex];
              if (uploadResponse) {
                const fieldIndex = payload.fields.findIndex(field => field.name === 'profile');
                console.log(`Updating profile field at index ${fieldIndex} with value:`, uploadResponse.filePath || uploadResponse.fileName);
                if (fieldIndex !== -1) {
                  payload.fields[fieldIndex].value = uploadResponse.filePath || uploadResponse.fileName;
                }
              }
              responseIndex++;
            }
            
            if (this.selectedKycFile) {
              const uploadResponse = uploadResponses[responseIndex];
              if (uploadResponse && uploadResponse !== null) {
                const fieldIndex = payload.fields.findIndex(field => field.name === 'kycDocument');
                console.log(`Updating kycDocument field at index ${fieldIndex} with value:`, uploadResponse.filePath || uploadResponse.fileName);
                if (fieldIndex !== -1) {
                  payload.fields[fieldIndex].value = uploadResponse.filePath || uploadResponse.fileName;
                }
              } else {
                console.log('KYC upload failed, keeping original KYC data');
              }
            }
            console.log('Final payload before submission:', payload);

            this.service.addHelper(payload).subscribe({
              next: (res) => {
                console.log('Helper added successfully:', res);
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
              },
              error: (error) => {
                console.error('Error adding helper:', error);
                alert('Failed to add helper. Please try again.');
              }
            });
          }).catch(error => {
            console.error('Error uploading files:', error);
            // Still proceed with form submission even if file upload fails
            this.service.addHelper(payload).subscribe({
              next: (res) => {
                console.log('Helper added successfully (after upload error):', res);
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
              },
              error: (error) => {
                console.error('Error adding helper (after upload error):', error);
                alert('Failed to add helper. Please try again.');
              }
            });
          });
        } else {
          // No files to upload, proceed directly
          this.service.addHelper(payload).subscribe({
            next: (res) => {
              console.log('Helper added successfully (no files):', res);
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
            },
            error: (error) => {
              console.error('Error adding helper (no files):', error);
              alert('Failed to add helper. Please try again.');
            }
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
