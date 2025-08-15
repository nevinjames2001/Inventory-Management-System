import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { formatDate,CommonModule } from '@angular/common';
import { AgGridAngular } from "ag-grid-angular";
import { GenericFormComponent } from "../../components/generic-form/generic-form.component";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { RegistryService } from '../../service/registry.service';
ModuleRegistry.registerModules([AllCommunityModule]);

const dateFormatter = (params: any) =>
  params.value ? formatDate(params.value, 'MMM d, y', 'en-US') : '';

@Component({
  selector: 'app-supplier',
  imports: [AgGridAngular, GenericFormComponent,CommonModule],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css'
})
export class SupplierComponent implements OnInit{

  isEditable = false;
  rowData: any[] = [];
  originalRowData: any[] = [];
  chartOptions: Highcharts.Options = {};
    defaultColDef = {
    resizable: true,
    flex: 1,
    minWidth: 120,
    filter: true,
    sortable: true,
    editable:true
  };

  showSupplierModal = false;
  apiURL = "https://localhost:7144/api/Supplier/";




  formFields = [
    { name: 'supplierId', label: 'Supplier ID', type: 'hidden', required: false },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'text', required: true },
    { name: 'address', label: 'Address', type: 'text', required: false }
  ];

    tableFields = [
      { field: 'supplierId', headerName: 'Supplier ID',editable: () => this.isEditable },
      { field: 'name', headerName: 'Name', editable: () => this.isEditable },
      { field: 'email', headerName: 'Email',editable: () => this.isEditable },
      { field: 'phone', headerName: 'Phone',editable: () => this.isEditable },
      { field: 'address', headerName: 'Address', editable: () => this.isEditable },
      {field:'createdDate',headerName:'Created Date',valueFormatter: dateFormatter}
    ];


  constructor(private registryService: RegistryService,
    private fb: FormBuilder
  )
  {  }

  ngOnInit(): void {
    this.fetchSuppliers();
  }

  openCreateForm() {
    this.showSupplierModal = true;
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
        delete item.purchaseOrders;

        return this.registryService.updateRegistry({ ...item },
                      this.apiURL + item.supplierId);
          }
      );

      Promise.all(updateCalls.map(obs => obs.toPromise()))
        .then(() => {
          this.isEditable = false;
          this.fetchSuppliers();
        })
        .catch(err => console.error('Save failed:', err));

     this.rowData = [...this.originalRowData]; // Revert
     this.fetchSuppliers();
   }

   handleSave(formData: any) {
        // Create
        formData.CreatedDate = this.getTodayDate();
        formData.modifiedDate = this.getTodayDate();
        delete formData.supplierId;
        console.log(formData);
        this.registryService.createRegistry(this.apiURL,formData)
          .subscribe(() => this.fetchSuppliers());
  }

    fetchSuppliers(){
      this.registryService.getRegistries(this.apiURL).subscribe(data => {
        this.rowData = data;
      })
    }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString(); // e.g., "2025-07-29T18:34:00.000Z"
  }

  onCellValueChanged(event: any) {
    const updatedData = event.data;
    console.log(updatedData)
    delete updatedData.purchaseOrders;
      this.registryService.updateRegistry(updatedData,this.apiURL + updatedData.supplierId).subscribe(() => {
        console.log('Updated successfully');
      });
   }



}
