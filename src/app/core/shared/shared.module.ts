import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { DataTablesModule } from "angular-datatables";
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

const modules = [
  ReactiveFormsModule,
  FormsModule,
  DataTablesModule,
  NgSelectModule,
  SweetAlert2Module
];


@NgModule({
  declarations: [
    ConfirmationComponent,
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    ...modules
  ],
  exports: [...modules,ConfirmationComponent,LoaderComponent]
})
export class SharedAppModule { }
