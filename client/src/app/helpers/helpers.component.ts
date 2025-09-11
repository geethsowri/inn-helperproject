import { Component, OnInit, signal, ViewChild, ElementRef, HostListener, AfterViewInit, effect, runInInjectionContext, inject, EnvironmentInjector, computed, Signal, Injector } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
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
    SidebarComponent,
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

  helpers_number = signal(0);
  all_helpers: any;
  searchSignal = signal('');
  showdropdown: boolean = false;
  selectedSortField: number = 1;
  showdropdown_filter: boolean = false;
  filtered_helpers: any;
  tooltipText = "Upload data using excel";

  @ViewChild('servicedropdown') servicedropdown!: SelectDropdownComponent;
  @ViewChild('ordropdown') ordropdown!: SelectDropdownComponent;
  @ViewChild(HelpersListComponent) child!: HelpersListComponent;

  constructor(private service: ServiceService, private router: Router, private el: ElementRef, private route: ActivatedRoute,) { }

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

      if (!clickedInsideFilter) {
        this.showdropdown_filter = false;
      }

      if (!clickedInsideSort) {
        this.showdropdown = false;
      }
    }, 0);
  }

  serviceOptions = ['Maid', 'Cook', 'Nurse', 'Driver', 'Laundry', 'Newspaper', 'Plumber'];
  organizationOptions = ['ASBL', 'Springs Helpers'];

  selectedService: string = '';
  selectedOrganization: string = '';
  injector = inject(Injector);


  applyFilters() {
    const service = this.selectedService;
    const org = this.selectedOrganization;

    this.filtered_helpers = this.all_helpers.filter(helper => {
      const serviceField = helper.fields.find(f => f.name === 'serviceType');
      const orgField = helper.fields.find(f => f.name === 'organization');

      const matchesService = service ? serviceField?.value === service : true;
      const matchesOrg = org ? orgField?.value === org : true;

      return matchesService && matchesOrg;
    });

    this.showdropdown_filter = false;
  }

  resetFilters() {
    this.selectedService = '';
    this.selectedOrganization = '';
    this.filtered_helpers = [...this.all_helpers];
    this.showdropdown_filter = false;
  }


  ngOnInit(): void {

    this.service.display().subscribe((response) => {
      this.all_helpers = response;
      this.helpers_number.set(this.all_helpers.length);
    });

    if (this.all_helpers) {
      this.all_helpers.sort((a, b) => {
        const val1 = (getFieldValue(a.fields, 'fullName') || '').toLowerCase();
        const val2 = (getFieldValue(b.fields, 'fullName') || '').toLowerCase();
        return val1.localeCompare(val2);
      });
    }
  }

  addNewHelper() {
    this.router.navigate(['/helpers/add-helper'])
  }

  sortBy(value: any) {
    if (value === 'emp_id') {
      this.selectedSortField = 2;
    } else {
      this.selectedSortField = 1;
    }

    this.showdropdown = false;
    this.filtered_helpers = [...this.all_helpers];

    this.filtered_helpers.sort((a, b) => {
      let aVal: string, bVal: string;

      if (value === 'emp_id') {
        aVal = (a.emp_id || '').toLowerCase();
        bVal = (b.emp_id || '').toLowerCase();
      } else {
        aVal = (getFieldValue(a.fields, value) || '').toLowerCase();
        bVal = (getFieldValue(b.fields, value) || '').toLowerCase();
      }

      return aVal.localeCompare(bVal);
    });

    this.child.selectedHelper = this.filtered_helpers[0];
  }

  @ViewChild('excelFileClick') fileclick!: ElementRef<HTMLInputElement>;

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
