import { Routes } from '@angular/router';
import { HelpersComponent } from './helpers/helpers.component';
import { HelperformComponent } from './helperform/helperform.component';
import { EditHelperComponent } from './edit-helper/edit-helper.component';

export const routes: Routes = [
    { path: '', redirectTo: '/helpers', pathMatch: 'full' },
    { path: 'helpers', component: HelpersComponent },
    { path: 'helpers/add-helper', component: HelperformComponent },
    { path: 'helpers/edit-helper/:id', component: EditHelperComponent }
];
