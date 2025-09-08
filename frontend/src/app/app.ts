import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HelperListComponent } from './helper-list/helper-list';
import { HelperDetailComponent } from './helper-detail/helper-detail';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  imports: [
    MatSidenavModule, 
    HelperListComponent, 
    HelperDetailComponent
  ],
})
export class App {
  selectedHelper: any = null;
}