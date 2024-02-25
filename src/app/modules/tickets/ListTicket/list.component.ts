import {Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ConfirmationComponent} from "../../../core/shared/components/confirmation/confirmation.component";
import Swal from "sweetalert2";
import {HttpClient} from "@angular/common/http";
import {TicketService} from "../Service/Ticket.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UsersService} from "../../user/Service/users.service";

@Component({
  selector: 'app-ListTicket',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListTicketComponent {
  @ViewChild('closeModal') closeModal: ElementRef

  techList: any = [];
  ticketForm: any;
  allTickets: any = [];
  errors: any = [];
  formError: any = {};
  selectedId: number;
  selectedTech:number;
  message: string;
  editPopup: boolean;
  formSubmissionFlag: boolean = false;
  role:string;
  selectedRes:string="";
  selected:any;

  constructor(
    private http: HttpClient,
    private ticketService: TicketService,
    private viewContainer: ViewContainerRef,
    private userService: UsersService
  ) {

  }

  ngOnInit(): void {
    this.role=localStorage.getItem('userRole');
    this.getTicketList();
    this.setForm();
  }

  getTicketList() {
    this.ticketService.getTickets().subscribe({
      next: (data: any) => {
        this.allTickets = data;
      },
      error: (error: any) => console.log(error)
    })
  }

  setForm() {
    this.ticketForm = new FormGroup({
      title: new FormControl({value: '', disabled: this.editPopup}, [Validators.required]),
      description: new FormControl({value: '', disabled: this.editPopup}, [Validators.required]),
      treatement: new FormControl({value: '', disabled: this.editPopup}),
      treatedBy: new FormControl({value: '', disabled: this.role!=='ADMIN'})

    });
  }

  create() {
    if (!this.validForm() || this.ticketForm.invalid) {
      return
    }
    this.formSubmissionFlag = true;
    const formData: any = {};

    formData.title = this.ticketForm.value.title;
    formData.description = this.ticketForm.value.description;
    this.closeModal.nativeElement.click();
    this.formSubmissionFlag = false;

    this.ticketService.createTicker(formData)?.subscribe(async (res: any) => {
      if (res) {
        this.ticketForm.reset();
        this.closeModal.nativeElement.click();
        this.formSubmissionFlag = false;
        Swal.fire({
          title: '',
          text: 'Ticket created Successfully',
          icon: 'success',
          confirmButtonText: 'Close'
        }).then(() => this.getTicketList())
      }
    }, err => {
      console.log(err);
      Swal.fire({
        title: 'Error!',
        text: 'There is an error from backend side.\n' + err,
        icon: 'error',
        confirmButtonText: 'Close'
      }).then(r => this.getTicketList());
    })
  }

  read(i: any) {
    this.ticketForm.patchValue(i);
    this.editPopup = true;
    this.selectedId = i.id;
    this.getTechList();
    this.selectedTech = i.treatedBy?.id;
    this.selected=i;
    if(this.role == "ADMIN" && this.editPopup){

      this.ticketForm.addControl('treatedBy', new FormControl(''))
    }
    if (this.role !== "TECHNICIEN") {
      // Remove the 'treatement' control if it exists
      this.ticketForm.removeControl('treatement');
    }
    if (i.resolution){
      this.selectedRes=i.resolution
    }else{
      this.selectedRes="";
    }

    // setTimeout(() => {
    //   this.popUpShowHideFlag = !this.popUpShowHideFlag;
    // }, 500);
  }

  update() {
    if (!this.validForm() || (this.ticketForm.invalid && !this.editPopup)) {
      console.log("invalid");
      return
    }
    this.formSubmissionFlag = true;
    const formData: any = {};

    if (this.role!=='TECHNICIEN'){

      formData.title = this.ticketForm.value.title;
      formData.description = this.ticketForm.value.description;
      if (this.ticketForm.value.treatedBy) {
        formData.treatedBy = {};
        formData.treatedBy.id = this.ticketForm.value.treatedBy;
      }
      this.ticketForm.reset();
      this.closeModal.nativeElement.click();
      this.formSubmissionFlag = false;

      this.ticketService.editTicket(formData, this.selectedId)?.subscribe({
        next: (res: any) => {
          if (res) {
            this.formSubmissionFlag = false;
            this.closeModal.nativeElement.click();
            Swal.fire({
              title: '',
              text: 'Ticket updated Successfully',
              icon: 'success',
              confirmButtonText: 'Close'
            }).then(() => this.getTicketList())

          }
        }, error: (error: string) =>
          Swal.fire({
            title: 'Error!',
            text: 'There is an error from backend side.\n' + error,
            icon: 'error',
            confirmButtonText: 'Close'

          })
      })
    }else{
      const treatement = this.ticketForm.value.treatement;
      this.ticketForm.reset();
      this.closeModal.nativeElement.click();
      this.formSubmissionFlag = false;
      this.ticketService.treatTicket(treatement,this.selectedId)?.subscribe({
        next: (res: any) => {

            this.formSubmissionFlag = false;
            this.closeModal.nativeElement.click();
            Swal.fire({
              title: '',
              text: 'Ticket treated Successfully',
              icon: 'success',
              confirmButtonText: 'Close'
            }).then(() => this.getTicketList())


        }, error: (error: string) =>
          Swal.fire({
            title: 'Error!',
            text: 'There is an error from backend side.\n' + error,
            icon: 'error',
            confirmButtonText: 'Close'

          })
      })

    }
  }

  delete(i: any) {
    const dialogRef = this.viewContainer.createComponent(ConfirmationComponent)
    dialogRef.instance.visible = true;
    dialogRef.instance.action.subscribe(x => {
      if (x) {
        this.ticketService.deleteTicket(i.id)?.subscribe(
          {
            next: () => {
              dialogRef.instance.visible = false;
              Swal.fire({
                title: '',
                text: 'Ticket Deleted Successfully',
                icon: 'success',
                confirmButtonText: 'Close'
              }).then(() => this.getTicketList())
            },
            error: (error) => {
              Swal.fire({
                title: 'Error!',
                text: 'There is an error from backend side.\n' + error,
                icon: 'error',
                confirmButtonText: 'Close'
              }).then(r => console.log(r))
            }
          })
      }
    })
  }

  validForm() {
    this.errors = [];
    this.formError = {};
    let validFlag = true;

    if (!this.ticketForm.value.title) {
      this.errors.push('title');
      this.formError.errorForEmail = 'Title is required';
      validFlag = false;
    }
    if (!this.ticketForm.value.description) {
      this.errors.push('description');
      this.formError.errorForEmail = 'Description is required';
      validFlag = false;
    }

    return validFlag;
  }

  getTechList() {
    this.userService.techList().subscribe({
      next: (data: any) => {
        this.techList = data;
      },
      error: (error: any) => console.log(error)
    })
  }

}
