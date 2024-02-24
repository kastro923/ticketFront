import {Component, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {UsersService} from '../Service/users.service';
import {ConfirmationComponent} from '../../../core/shared/components/confirmation/confirmation.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef


  userForm: any;
  allUsers: any = [];
  userRoles: any = [];
  errors: any = [];
  formError: any = {};

  message: string;

  userImage: string;
  editPopup: boolean;
  formSubmissionFlag: boolean = false;

  constructor(
    private http: HttpClient,
    private usersService: UsersService,
    private viewContainer: ViewContainerRef
  ) {

  }

  ngOnInit(): void {
    this.getUserList();
    this.getUserRoleList();
    this.setForm();
  }

  getUserList() {
    this.usersService.getUsers().subscribe({
      next: (data: any) => {
        this.allUsers = data;
      },
      error: (error: any) => console.log(error)
    })
  }

  getUserRoleList() {
    this.userRoles = [
      {
        roleName: 'ADMIN'
      },
      {
        roleName: 'TECHNICIEN'
      },
      {
        roleName: 'EMPLOYEE'
      }
    ]
  }

  setForm() {
    this.userForm = new FormGroup({
      role: new FormControl({ value: '', disabled: this.editPopup }, [Validators.required]),
      email: new FormControl({ value: '', disabled: this.editPopup }, [Validators.required]),
      username: new FormControl({ value: '', disabled: this.editPopup }, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      password_confirmation: new FormControl(null, [Validators.required,]),
    }, {validators: this.passwordMatchValidator});
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('password_confirmation');

    if (!password || !confirmPassword || password.value === confirmPassword.value) {
      return null; // Matched
    }

    return {'passwordMismatch': true};
  }

  updateLoginStatus(item) {
    if (item.loginStatus) {
      item.loginStatus = 0
    } else {
      item.loginStatus = 1
    }
    ;
    this.userForm.patchValue({'loginStatus': item.loginStatus});
    this.userForm.patchValue(item)
    this.update();
  }


  create() {
    if (!this.validForm() || this.userForm.invalid) {
      return
    }
    this.formSubmissionFlag = true;
    const formData: any = {};

    formData.role = this.userForm.value.role;
    formData.email = this.userForm.value.email;
    formData.password = this.userForm.value.password;
    formData.password_confirmation = this.userForm.value.password_confirmation;
    formData.username = this.userForm.value.username;
    this.userForm.reset();
    this.closeModal.nativeElement.click();
    this.formSubmissionFlag = false;

    this.usersService.createUser(formData)?.subscribe(async (res: any) => {
      if (res) {
        this.userForm.reset();
        this.closeModal.nativeElement.click();
        this.formSubmissionFlag = false;
        Swal.fire({
          title: '',
          text: 'User created Successfully',
          icon: 'success',
          confirmButtonText: 'Close'
        }).then(() => this.getUserList())
      }
    }, err => {
      console.log(err);
      Swal.fire({
        title: 'Error!',
        text: 'There is an error from backend side.\n' + err,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    })
  }

  read(i: any) {
    this.userForm.patchValue(i);
    this.editPopup = true;
    // setTimeout(() => {
    //   this.popUpShowHideFlag = !this.popUpShowHideFlag;
    // }, 500);
  }

  update() {
    if (!this.validForm() || (this.userForm.invalid && !this.editPopup)) {
      console.log("invalid");
      return
    }
    this.formSubmissionFlag = true;
    const formData: any = {};

    formData.role = this.userForm.value.role;
    formData.email = this.userForm.value.email;
    formData.password = this.userForm.value.password;
    formData.password_confirmation = this.userForm.value.password_confirmation;
    formData.username = this.userForm.value.username;
    this.userForm.reset();
    this.closeModal.nativeElement.click();
    this.formSubmissionFlag = false;

     this.usersService.editUser(formData)?.subscribe({
       next:(res:any) =>{
      if (res) {
        this.formSubmissionFlag = false;
        this.closeModal.nativeElement.click();
        Swal.fire({
          title: '',
          text: 'User updated Successfully',
          icon: 'success',
          confirmButtonText: 'Close'
        }).then(() => this.getUserList())
        
      }
    } ,error:(error: string) =>
      Swal.fire({
        title: 'Error!',
        text: 'There is an error from backend side.\n' + error,
        icon: 'error',
        confirmButtonText: 'Close'

      })
  })
  }

  delete(i: any) {
    const dialogRef = this.viewContainer.createComponent(ConfirmationComponent)
    dialogRef.instance.visible = true;
    dialogRef.instance.action.subscribe(x => {
      if (x) {
        this.usersService.deleteUser(i.id)?.subscribe(
          {
            next:(res)=>{
              dialogRef.instance.visible = false;
              Swal.fire({
                title: '',
                text: 'User Deleted Successfully',
                icon: 'success',
                confirmButtonText: 'Close'
              }).then(()=>this.getUserList())
            },
            error:(error)=>{
              Swal.fire({
                title: 'Error!',
                text: 'There is an error from backend side.\n' + error,
                icon: 'error',
                confirmButtonText: 'Close'
              }).then(r =>console.log(r))
            }
          })
      }
    })
  }

  validForm() {
    this.errors = [];
    this.formError = {};
    let validFlag = true;
   
    if (!this.userForm.value.email) {
      this.errors.push('email');
      this.formError.errorForEmail = 'Email is required';
      validFlag = false;
    }
    if (!this.userForm.value.password && !this.editPopup) {
      this.errors.push('password');
      this.formError.errorForPassword = 'Password is required';
      validFlag = false;
    }


    if (!this.userForm.value.password_confirmation && !this.editPopup) {
      this.errors.push('password_confirmation');
      this.formError.password_confirmation = 'Confirm Password is required';
      validFlag = false;
    }

    if (this.userForm.invalid && !this.editPopup) {
      this.errors.push("password_confirmation")
      this.formError.password_confirmation = "Password mismatch"
      validFlag = false;
    }
    return validFlag;
  }


}
