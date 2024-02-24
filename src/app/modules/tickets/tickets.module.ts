import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsRoutingModule } from './tickets-routing.module';
import {ListTicketComponent} from './ListTicket/list.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ListTicketComponent
  ],
  imports: [
    CommonModule,
    TicketsRoutingModule,
    ReactiveFormsModule
  ]
})
export class TicketsModule { }
