import {API_ENDPOINTS, ApiMethod} from '../../../core/shared/utils/const';
import {ApiHandlerService} from '../../../core/shared/utils/api-handler.service';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: ApiHandlerService) {
  }

  getUsers() {
    return this.http.requestCall(API_ENDPOINTS.users, ApiMethod.GET, '');
  }

  deleteUser(i: any) {
    return this.http.requestCall(API_ENDPOINTS.deleteUser, ApiMethod.DELETE, i)
  }

  editUser(data: any,id:number) {
    return this.http.requestCall(API_ENDPOINTS.updateUser+id, ApiMethod.PUT, '', data)
  }

  createUser(data: any) {
    return this.http.requestCall(API_ENDPOINTS.createUser, ApiMethod.POST, '', data)
  }

  techList(){
    return this.http.requestCall(API_ENDPOINTS.techList,ApiMethod.GET,'');
  }

}
