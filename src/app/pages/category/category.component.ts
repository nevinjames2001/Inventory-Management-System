import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridAngular } from "ag-grid-angular";
import { GenericFormComponent } from "../../components/generic-form/generic-form.component";
import { CommonModule } from '@angular/common';
import { FormField } from '../../interface/FormField';
import { RegistryService } from '../../service/registry.service';
import { Categories } from '../../interface/category';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-category',
  imports: [AgGridAngular, GenericFormComponent,CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{
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

    selectedCategory:any = null;
  showCategoryModal = false;
  apiURL = "https://localhost:7144/api/category/";


    formFields:FormField[] = [
    // { name: 'categoryId', label: 'Category ID', type: 'hidden', required: false },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'parentCategoryID', label: 'Parent Category', type: 'dropdown', required: true,options:[],optionLabel:'label',optionValue:'value' },
    { name: 'description', label: 'Description', type: 'text', required: true },
  ];

    tableFields = [
      { field: 'categoryId', headerName: 'Category ID',editable: () => this.isEditable },
      { field: 'name', headerName: 'Name', editable: () => this.isEditable },
       {
          field: 'parentCategoryId',                 // <-- normalized
          headerName: 'Parent Category',
          editable: () => this.isEditable,
          cellEditor: 'agSelectCellEditor',
          // supply the list of *IDs* as strings to the select editor
          cellEditorParams: () => ({
            values: this.rowData.map(c => String(c.categoryId)) // ['1','2',...]
          }),
          // display the *name* for the stored ID
          valueFormatter: (params: any) => {
            const id = Number(params.value);
            const parent = this.rowData.find(c => c.categoryId === id);
            return parent ? parent.name : '';
          },
          // ensure edits write back a number to your data model
          valueSetter: (params: any) => {
            const newId = Number(params.newValue);
            if (params.data.parentCategoryId !== newId) {
              params.data.parentCategoryId = newId;
              // optional: keep a lightweight parent ref if you use it elsewhere
              params.data.parentCategory = this.rowData.find(c => c.categoryId === newId) ?? null;
              return true; // tells ag-grid the value changed
            }
            return false;
          }
        },
      { field: 'description', headerName: 'Description',editable: () => this.isEditable },
      ];

    constructor(private registryService: RegistryService,
    private fb: FormBuilder
    )
  { }

    ngOnInit(): void {
      this.fetchCategories();
    }

    openCreateForm() {
        this.showCategoryModal = true;
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
    console.log(this.rowData);

    const updateCalls = this.rowData.map(item => {
      const id = item.categoryId;
      console.log("1")
      return this.registryService.updateRegistry({ ...item },this.apiURL+id);
    });

    Promise.all(updateCalls.map(obs => obs.toPromise()))
      .then(() => {
        this.isEditable = false;
        this.fetchCategories();  // Refresh table
      })
      .catch(err => console.error('Save failed:', err));

    this.fetchCategories();
    console.log('Reverted rowData:', this.rowData);
  }


   handleSave(formData: Categories) {
      this.registryService.createRegistry(this.apiURL,formData)
          .subscribe(() => this.fetchCategories());
  }

    fetchCategories(){
      this.registryService.getRegistries(this.apiURL).subscribe(data => {
        console.log(data)
        this.rowData = data;

          const dropdownField = this.formFields.find(f => f.name === 'parentCategoryID');
        if (dropdownField) {
              console.log(dropdownField)
              dropdownField.options = data.map((item: any) => ({
                label: item.name,
                value: item.categoryId
              }));
            }
      })
    }


  onCellValueChanged(event: any) {
    const updatedData = event.data;
    delete updatedData.parentCategory;
    delete updatedData.inventoryItems;
    delete updatedData.inverseParentCategory;
    updatedData.parentCategoryId = Number(updatedData.parentCategoryId);
    this.registryService.updateRegistry( updatedData,this.apiURL+updatedData.categoryId).subscribe(() => {
      console.log('Updated successfully');
    });
    }
}
