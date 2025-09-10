import { Component, Input, Signal, computed, inject, effect, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../services/service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
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
    });
  }

  filteredHelpers = computed(() => {
    const searchTerm = this.search()?.toLowerCase().trim() ?? '';
    const baseList = this.helpers()?.length > 0 ? this.helpers() : this.all_helpers;
    if (this.helpers() && this.helpers().length > 0) {
      this.selectedHelper = this.helpers()[0];
    }
    else{
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

  getFieldValue(fields: any[], fieldName: string): string {
    const found = fields?.find(f => f.name === fieldName);
    if (found?.value?.trim()) return found.value;
    if (Array.isArray(found?.values)) return found.values.join(', ');
    return '-';
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
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/helpers']);
          });
        });
      }
    });
  }
}
