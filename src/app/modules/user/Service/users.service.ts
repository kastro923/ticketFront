import {API_ENDPOINTS, ApiMethod} from '../../../core/shared/utils/const';
import {ApiHandlerService} from '../../../core/shared/utils/api-handler.service';
import {Injectable} from '@angular/core';
import {error} from "@angular/compiler-cli/src/transformers/util";

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

  editUser(data: any) {
    return this.http.requestCall(API_ENDPOINTS.updateUser, ApiMethod.PUT, '', data)
  }

  createUser(data: any) {
    return this.http.requestCall(API_ENDPOINTS.createUser, ApiMethod.POST, '', data)
  }

}
