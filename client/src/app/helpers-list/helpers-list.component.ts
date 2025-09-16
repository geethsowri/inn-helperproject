import { Component, Input, Signal, computed, inject, effect, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../services/service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { IdCardComponent } from '../id-card/id-card.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// helper function for filtering search
function getFieldValue(fields: any[], key: string): string {
  const field = fields.find(f => f.name === key);
  return (field?.value ?? '').toLowerCase();
}

@Component({
  selector: 'app-helpers-list',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './helpers-list.component.html',
  styleUrl: './helpers-list.component.scss'
})
export class HelpersListComponent {
  private service = inject(ServiceService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // reactive state
  all_helpers = signal<any[]>([]);
  selectedHelper: any = null;

  @Input() search!: Signal<string>;
  readonly helpers = input<any[]>();

  constructor() {
    // auto-update selectedHelper whenever filteredHelpers changes
    effect(() => {
      const list = this.filteredHelpers();
      this.selectedHelper = list?.length > 0 ? list[0] : null;
    });

    // initial load
    this.service.display().subscribe((response: any[]) => {
      this.all_helpers.set(response ?? []);
    });
  }

  ngOnInit() {
    this.service.display().subscribe((response: any[]) => {
      this.all_helpers.set(response ?? []);
      this.selectedHelper = this.all_helpers()[0] ?? null;
    });
  }

  filteredHelpers = computed(() => {
    const searchTerm = this.search()?.toLowerCase().trim() ?? '';
    const baseList = this.helpers()?.length > 0 ? this.helpers() : this.all_helpers();

    if (searchTerm) {
      return baseList.filter(helper => {
        const fullName = getFieldValue(helper.fields, 'fullName');
        const phone = getFieldValue(helper.fields, 'phone');
        return fullName.includes(searchTerm) || phone.includes(searchTerm);
      });
    }

    return baseList;
  });

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
        profile: this.getProfileImageUrl(helper.fields)
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
    return !!profileField?.value && profileField.value !== '-' && profileField.value !== null && profileField.value !== '';
  }

  getProfileImageUrl(fields: any[]): string {
    const profileField = fields?.find(f => f.name === 'profile');
    if (!profileField?.value) return '';

    const value = profileField.value;

    // if it’s a data URL, return as-is
    if (value.startsWith('data:')) return value;

    // if full URL, return as-is
    if (value.startsWith('http')) return value;

    // relative path from backend
    if (value.startsWith('/uploads/')) return `http://localhost:3002${value}`;

    return `http://localhost:3002/uploads/${value}`;
  }

  editHelper(helper: any): void {
    this.router.navigate(['/helpers/edit-helper', helper._id]);
  }

  deleteHelper(helper: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: { ...helper.fields, deletion: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.service.deleteHelper(helper._id).subscribe(() => {
          this.snackBar.open('Helper deleted successfully!', 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-success']
          });
          // remove deleted helper reactively
          this.all_helpers.update(list => list.filter(h => h._id !== helper._id));
          if (this.selectedHelper?._id === helper._id) {
            this.selectedHelper = this.all_helpers()[0] ?? null;
          }
        });
      }
    });
  }
}
