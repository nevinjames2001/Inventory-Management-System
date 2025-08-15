import { Component, OnInit } from '@angular/core';
import Highcharts from 'highcharts';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { GenericFormComponent } from "../../../components/generic-form/generic-form.component";
import { CommonModule, formatDate } from '@angular/common';
import { RegistryService } from '../../../service/registry.service';
import { Warehouse } from '../../../interface/warehouse';

ModuleRegistry.registerModules([AllCommunityModule]);
const dateFormatter = (params: any) =>
  params.value ? formatDate(params.value, 'MMM d, y', 'en-US') : '';

@Component({
  standalone: true,
  selector: 'app-list',
  imports: [AgGridModule, ReactiveFormsModule, DialogModule, DropdownModule, GenericFormComponent,CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  chartOptions: Highcharts.Options = {};
  rowData: any[] = [];
  formFields = [
    { name: 'warehouseId', label: 'Warehouse ID', type: 'hidden', required: false },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'location', label: 'Location', type: 'text', required: true },
    { name: 'contactNumber', label: 'Contact Number', type: 'text', required: true },
    { name: 'managerName', label: 'Manager Name', type: 'text', required: true },
    { name: 'isActive', label: 'Active', type: 'radio', required: false,options:['True','False'] },
    { name: 'CreatedDate', label: 'Created Date', type: 'hidden', required: false }
  ];

  tableFields = [
    { field: 'warehouseId', headerName: 'Warehouse ID' ,editable: () => this.isEditable},
    { field: 'name', headerName: 'Name' ,editable: () => this.isEditable},
    { field: 'location', headerName: 'Location',editable: () => this.isEditable},
    { field: 'contactNumber', headerName: 'Contact Number' ,editable: () => this.isEditable},
    { field: 'managerName', headerName: 'Manager Name' ,editable: () => this.isEditable},
    {
      field: 'isActive',
      headerName: 'Active',
      cellRenderer: (params: { value: boolean; }) => {
        const isChecked = params.value ? 'checked' : '';
        return `<input type="checkbox" ${isChecked} disabled />`;
      },
      cellRendererParams: {
        suppressInputEvents: true
      }
    },
    { field: 'createdDate', headerName: 'Created Date',valueFormatter: dateFormatter },
    { field: 'modifiedDate', headerName: 'Modified Date',valueFormatter: dateFormatter }

  ];



  defaultColDef = {
    resizable: true,
    flex: 1,
    minWidth: 120,
    filter: true,
    sortable: true,
    editable:true
  };

  showCreateWarehouseModal = false;

  editingWarehouseId: number | null = null;

  showWarehouseModal = false;
  isEditable = false;
  originalRowData: any[] = [];
  apiURL = "https://localhost:7144/api/Warehouse/";



  constructor(private registryService: RegistryService,
    private fb: FormBuilder
  )
  {
   }

  ngOnInit(): void {
      this.fetchWarehouses();
  }

  openCreateForm() {
    this.showWarehouseModal = true;
  }

  toggleEdit() {
    this.isEditable = true;
    this.originalRowData = JSON.parse(JSON.stringify(this.rowData)); // Deep clone
    this.tableFields = [...this.tableFields]; // Refresh grid
  }

  cancelEdit() {
    this.isEditable = false;
    this.rowData = [...this.originalRowData]; // Revert
    this.tableFields = [...this.tableFields];
  }

  saveAll() {
     const updateCalls = this.rowData.map(item => {
       item.modifiedDate = this.getTodayDate();
        return this.registryService.updateRegistry({ ...item },
                      this.apiURL + item.warehouseId);
          }
      );

    Promise.all(updateCalls.map(obs => obs.toPromise()))
      .then(() => {
        this.isEditable = false;
        this.fetchWarehouses();
      })
      .catch(err => console.error('Save failed:', err));

    this.rowData = [...this.originalRowData]; // Revert

  }



  handleSave(formData: Warehouse) {
        // Create
    formData.CreatedDate = this.getTodayDate();
    formData.modifiedDate = this.getTodayDate();
    delete formData.warehouseId;
    console.log(formData);
    this.registryService.createRegistry(this.apiURL,formData)
          .subscribe(() => this.fetchWarehouses());

  }

  fetchWarehouses() {
      this.registryService.getRegistries(this.apiURL).subscribe(data => {
        this.rowData = data;
      })
  }


  onCellValueChanged(event: any) {
    const updatedData = event.data;
    delete updatedData.inventoryItems;
    delete updatedData.transferRecordFromWarehouses;
    delete updatedData.transferRecordToWarehouses;
      this.registryService.updateRegistry(updatedData,this.apiURL + updatedData.warehouseId).subscribe(() => {
        console.log('Updated successfully');
      });
  }


  getTodayDate(): string {
    const today = new Date();
    return today.toISOString(); // e.g., "2025-07-29T18:34:00.000Z"
  }




}
