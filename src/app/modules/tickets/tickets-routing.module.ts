import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListTicketComponent} from "./ListTicket/list.component";

const routes: Routes = [{ path: '', component: ListTicketComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { }
