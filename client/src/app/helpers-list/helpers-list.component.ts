import { Component, Input, Signal, computed, inject, effect, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../services/service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { IdCardComponent } from '../id-card/id-card.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

function getFieldValue(fields: any[], key: string): string {
  const field = fields.find(f => f.name === key);
  return (field?.value ?? '').toLowerCase();
}

@Component({
  selector: 'app-helpers-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './helpers-list.component.html',
  styleUrl: './helpers-list.component.scss'
})
export class HelpersListComponent {
  private service = inject(ServiceService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  all_helpers: any;
  selectedHelper: any;

  @Input() search!: Signal<string>;
  readonly helpers = input<any[]>();

  ngOnInit() {
    this.service.display().subscribe((response: any[]) => {
      this.all_helpers = response ?? [];
      this.selectedHelper = this.all_helpers[0];
      console.log('All helpers loaded:', this.all_helpers);
      if (this.all_helpers.length > 0) {
        console.log('First helper fields:', this.all_helpers[0].fields);
      }
    });
  }

  filteredHelpers = computed(() => {
    const searchTerm = this.search()?.toLowerCase().trim() ?? '';
    const baseList = this.helpers()?.length > 0 ? this.helpers() : this.all_helpers;
    if (this.helpers() && this.helpers().length > 0) {
      this.selectedHelper = this.helpers()[0];
    }
    else {
      this.selectedHelper = null;
    }


    if (searchTerm) {
      return baseList.filter(helper => {
        const fullName = getFieldValue(helper.fields, 'fullName');
        const phone = getFieldValue(helper.fields, 'phone');
        return fullName.includes(searchTerm) || phone.includes(searchTerm);
      });
    }

    return baseList;
  });

  constructor() {
    effect(() => {
      const list = this.filteredHelpers();
      if (list?.length > 0) {
        this.selectedHelper = list[0];
      } else {
        this.selectedHelper = null;
      }
    });

    this.service.display().subscribe((response: any[]) => {
      this.all_helpers = response ?? [];
    });
  }


  selectHelper(helper: any) {
    this.selectedHelper = helper;
  }
  openIdCard(helper: any) {
    const plainObj: any = {};
    helper.fields.forEach((f: any) => {
      plainObj[f.name] = f.value || f.values;
    });

    this.dialog.open(IdCardComponent, {
      width: '600px',
      data: {
        emp_id: helper.emp_id,
        fullName: plainObj.fullName,
        role: plainObj.serviceType,
        organization: plainObj.organization,
        phone: plainObj.phone,
        email: plainObj.email,
        joinDate: new Date().toLocaleDateString(),
        profile: plainObj.profile
      }
    });
  }


  getFieldValue(fields: any[], fieldName: string): string {
    const found = fields?.find(f => f.name === fieldName);
    if (found?.value?.trim()) return found.value;
    if (Array.isArray(found?.values)) return found.values.join(', ');
    return '-';
  }

  hasProfileImage(fields: any[]): boolean {
    const profileField = fields?.find(f => f.name === 'profile');
    return profileField?.value && profileField.value !== '-' && profileField.value !== null && profileField.value !== '';
  }

  getProfileImageUrl(fields: any[]): string {
    const profileField = fields?.find(f => f.name === 'profile');
    console.log('Profile field found:', profileField);
    console.log('All fields:', fields);

    if (profileField?.value && profileField.value !== '-') {
      // If the value is already a full URL, return it as is
      if (profileField.value.startsWith('http')) {
        return profileField.value;
      }
      // If it's a relative path, make it a full URL
      if (profileField.value.startsWith('/uploads/')) {
        return `http://localhost:3002${profileField.value}`;
      }
      // If it's just a filename, construct the full path
      return `http://localhost:3002/uploads/${profileField.value}`;
    }
    return '';
  }

  editHelper(helper: any): void {
    this.router.navigate(['/helpers/edit-helper', helper._id]);
  }

  deleteHelper(helper: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        ...helper.fields,
        deletion: 0
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.service.deleteHelper(helper._id).subscribe(() => {
          this.snackBar.open('Helper deleted successfully!', 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-success']
          });
          this.all_helpers = this.all_helpers.filer((h: any) => h._id != helper._id);
        });
      }
    });
  }
}
