import { Routes } from '@angular/router';
import { ListComponent } from './pages/warehouse/list/list.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { CategoryComponent } from './pages/category/category.component';
export const routes: Routes = [
  { path: 'warehouse',  component: ListComponent},
  { path: 'supplier', component: SupplierComponent },
  {path:'category',component:CategoryComponent}]
