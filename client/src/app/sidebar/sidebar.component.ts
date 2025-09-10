import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  constructor(private router: Router) {}
  
  sidebarItems: any = [
    { 
      main_name: 'RESIDENT',
      items: [
        { image:'assets/images/building.png',name: 'Flats' },
        { image:'assets/images/building.png',name: 'Helpdesk Setup' },
        { image:'assets/images/building.png',name: 'Helpdesk Tickets' },
        { image:'assets/images/building.png',name: 'Renovation Works' },
        { image:'assets/images/building.png',name: 'Violation Setup' },
        { image:'assets/images/building.png',name: 'Violation Tickets' },
        { image:'assets/images/building.png',name: 'Amenities' }
      ],
      isOpen: false
    },
    {
      main_name: 'STAFF',
      items: [
        { image:'assets/images/building.png',name: 'Roles & Departments' },
        { image:'assets/images/building.png',name: 'Staff Directory' },
        { image:'assets/images/building.png',name: 'Helpers' }
      ],
      isOpen: false
    },
    {
      main_name: 'WORK',
      items: [
        { image:'assets/images/building.png',name: 'Assets' },
        { image:'assets/images/building.png',name: 'Locations' },
        { image:'assets/images/building.png',name: 'Work Packages' },
        { image:'assets/images/building.png',name: 'Work Scheduler' },
        { image:'assets/images/building.png',name: 'Work Logs' },
        { image:'assets/images/building.png',name: 'Issues' }
      ],
      isOpen: false
    }
  ]

  selected: { groupIdx: number, itemIdx: number } | null = null;

  ngOnInit() {
    if(this.router.url == '/helpers' || this.router.url == '/helpers/add-helper'){
      const staff_idx = this.sidebarItems.findIndex((item: any) => item.main_name === 'STAFF');

      if(staff_idx !== -1){
        this.sidebarItems[staff_idx].isOpen = true;
        const helpers_idx = this.sidebarItems[staff_idx].items.findIndex((item: any) => item.name === 'Helpers');
        if(helpers_idx !== -1){
          this.selected = { groupIdx:staff_idx, itemIdx: helpers_idx };
        }
      }
    }
  }

  selectItem(groupIdx: number, itemIdx: number,name: string): void {
    this.selected = { groupIdx, itemIdx };
    if (name === 'Helpers') {
      this.router.navigate(['/helpers']);
    }
  }
}
