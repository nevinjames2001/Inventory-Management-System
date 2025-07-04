import { Routes } from '@angular/router';
import { ListComponent } from './pages/warehouse/list/list.component';
import { DetailsComponent } from './pages/warehouse/details/details.component';
import { CreateComponent } from './pages/warehouse/create/create.component';
import { EditComponent } from './pages/warehouse/edit/edit.component';

export const routes: Routes = [
  { path: 'warehouse', redirectTo: 'warehouse/list', pathMatch: 'full' },
  { path: 'warehouse/list', component: ListComponent },
  { path: 'warehouse/:playerId/details', component: DetailsComponent },
  { path: 'warehouse/create', component: CreateComponent },
  { path: 'warehouse/:playerId/edit', component: EditComponent }
];
