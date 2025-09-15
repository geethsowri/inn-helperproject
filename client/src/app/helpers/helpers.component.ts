import {
  Component, OnInit, signal, ViewChild, ElementRef,
  HostListener, inject, Injector, computed
} from '@angular/core';
import { HelpersListComponent } from '../helpers-list/helpers-list.component';
import { ServiceService } from '../services/service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelectDropdownComponent } from '../select-dropdown/select-dropdown.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperformComponent } from '../helperform/helperform.component';

function getFieldValue(fields: any[], key: string): string {
  const field = fields.find(f => f.name === key);
  return field?.value?.toLowerCase() ?? '';
}

@Component({
  selector: 'app-helpers',
  standalone: true,
  imports: [
    HelpersListComponent,
    CommonModule,
    SelectDropdownComponent,
    FormsModule,
    HelperformComponent
  ],
  templateUrl: './helpers.component.html',
  styleUrl: './helpers.component.scss'
})
export class HelpersComponent implements OnInit {
  all_helpers = signal<any[]>([]);
  searchSignal = signal('');
  helpers_number = signal(0);
  selectedSortField = 1;
  showdropdown = false;
  showdropdown_filter = false;

  selectedService = '';
  selectedOrganization = '';

  tooltipText = 'Upload data using excel';

  @ViewChild('servicedropdown') servicedropdown!: SelectDropdownComponent;
  @ViewChild('ordropdown') ordropdown!: SelectDropdownComponent;
  @ViewChild(HelpersListComponent) child!: HelpersListComponent;
  @ViewChild('excelFileClick') fileclick!: ElementRef<HTMLInputElement>;

  injector = inject(Injector);

  constructor(
    private service: ServiceService,
    private router: Router,
    private el: ElementRef,
    private route: ActivatedRoute,
  ) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    setTimeout(() => {
      const target = event.target as HTMLElement;
      const filterBtn = this.el.nativeElement.querySelector('#filter');
      const filterBox = this.el.nativeElement.querySelector('.filter-options');
      const sortBtn = this.el.nativeElement.querySelector('#sort');
      const sortBox = this.el.nativeElement.querySelector('.sort-options');

      const clickedInsideFilter = filterBtn?.contains(target) || filterBox?.contains(target);
      const clickedInsideSort = sortBtn?.contains(target) || sortBox?.contains(target);

      if (!clickedInsideFilter) this.showdropdown_filter = false;
      if (!clickedInsideSort) this.showdropdown = false;
    }, 0);
  }

  serviceOptions = ['Maid', 'Cook', 'Nurse', 'Driver', 'Laundry', 'Newspaper', 'Plumber'];
  organizationOptions = ['ASBL', 'Springs Helpers'];

  // 🔑 Core: computed filtered list
  filtered_helpers = computed(() => {
    const term = this.searchSignal().toLowerCase();
    if (!term) return this.all_helpers();

    return this.all_helpers().filter(helper => {
      const name = getFieldValue(helper.fields, 'fullName');
      const empId = helper.emp_id?.toLowerCase() || '';
      const phone = helper.phone?.toLowerCase() || '';
      return name.includes(term) || empId.includes(term) || phone.includes(term);
    });
  });

  ngOnInit(): void {
    this.service.display().subscribe((response: any[]) => {
      this.all_helpers.set(response);
      this.helpers_number.set(response.length);

      // Default sort
      this.all_helpers.update(arr =>
        [...arr].sort((a, b) => {
          const val1 = getFieldValue(a.fields, 'fullName');
          const val2 = getFieldValue(b.fields, 'fullName');
          return val1.localeCompare(val2);
        })
      );
    });
  }

  addNewHelper() {
    this.router.navigate(['/helpers/add-helper']);
  }

  sortBy(value: string) {
    this.selectedSortField = value === 'emp_id' ? 2 : 1;
    this.showdropdown = false;

    this.all_helpers.update(arr =>
      [...arr].sort((a, b) => {
        const val1 = getFieldValue(a.fields, 'fullName');
        const val2 = getFieldValue(b.fields, 'fullName');
        return val1.localeCompare(val2);
      })
    );


    this.child.selectedHelper = this.all_helpers[0];
  }

  applyFilters() {
    this.showdropdown_filter = false;
    // no manual filtering needed — computed takes care of it
  }

  resetFilters() {
    this.selectedService = '';
    this.selectedOrganization = '';
    this.showdropdown_filter = false;
    // computed auto-refreshes
  }

  activateInput() {
    this.fileclick.nativeElement.click();
  }

  openExcel(event: any) {
    this.router.navigate(['/helpers/add-helper']).then(() => {
      this.service.triggerHelpersFunction(event);
    });
  }

  DownloadasExcel() {
    this.service.downloadfunc(this.all_helpers).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'helpers.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
