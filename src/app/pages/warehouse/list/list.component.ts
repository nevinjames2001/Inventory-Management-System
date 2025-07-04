import { Component, OnInit } from '@angular/core';
import Highcharts from 'highcharts';
import { WarehouseService } from '../../../service/warehouse.service';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  standalone: true,
  selector: 'app-list',
  imports: [AgGridModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  chartOptions: Highcharts.Options = {};
  rowData: any[] = [];
  columnDefs = [
    { headerName: 'ID', field: 'warehouseId' },
    { headerName: 'Name', field: 'warehouseName' },
    { headerName: 'Street', field: 'streetAddress' },
    { headerName: 'City', field: 'city' },
    { headerName: 'Province', field: 'province' },
    { headerName: 'Country', field: 'country' },
    { headerName: 'Latitude', field: 'latitude' },
    { headerName: 'Longitude', field: 'longitude' }
  ];

  defaultColDef = {
    resizable: true,
    flex: 1,
    minWidth: 120,
    filter: true,
    sortable: true
  };

  constructor(private WarehouseService: WarehouseService) { }




  ngOnInit(): void {
    this.WarehouseService.getWarehouses().subscribe(data => {
      this.rowData = data;
      console.log(data);


    });
  }
}
