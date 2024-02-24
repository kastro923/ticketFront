import {Injectable} from '@angular/core';
import {ApiHandlerService} from "../../../core/shared/utils/api-handler.service";
import {API_ENDPOINTS, ApiMethod} from "../../../core/shared/utils/const";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: ApiHandlerService) { }


  getTickets(){
    return this.http.requestCall(API_ENDPOINTS.tickets, ApiMethod.GET);
  }

  createTicker(ticketData:any){
    return this.http.requestCall(API_ENDPOINTS.createTicket, ApiMethod.POST,null,ticketData)
  }
  deleteTicket(id:number){
    return this.http.requestCall(API_ENDPOINTS.deleteTicket+id,ApiMethod.DELETE);
  }

  editUser(formData: any,id:number) {
    return this.http.requestCall(API_ENDPOINTS.editTicket+id,ApiMethod.PUT,"",formData);
  }
}
