import {Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ConfirmationComponent} from "../../../core/shared/components/confirmation/confirmation.component";
import Swal from "sweetalert2";
import {HttpClient} from "@angular/common/http";
import {TicketService} from "../Service/Ticket.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ListTicket',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListTicketComponent {
  @ViewChild('closeModal') closeModal: ElementRef


  ticketForm: any;
  allTickets: any = [];
  errors: any = [];
  formError: any = {};
  selectedId:number;
  message: string;
  editPopup: boolean;
  formSubmissionFlag: boolean = false;

  constructor(
    private http: HttpClient,
    private ticketService: TicketService,
    private viewContainer: ViewContainerRef
  ) {

  }

  ngOnInit(): void {
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
      title: new FormControl({ value: '', disabled: this.editPopup }, [Validators.required]),
      description: new FormControl({ value: '', disabled: this.editPopup }, [Validators.required]),
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

    formData.title = this.ticketForm.value.title;
    formData.description = this.ticketForm.value.description;
    this.ticketForm.reset();
    this.closeModal.nativeElement.click();
    this.formSubmissionFlag = false;

     this.ticketService.editUser(formData,this.selectedId)?.subscribe({
       next:(res:any) =>{
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
        this.ticketService.deleteTicket(i.id)?.subscribe(
          {
            next:()=>{
              dialogRef.instance.visible = false;
              Swal.fire({
                title: '',
                text: 'Ticket Deleted Successfully',
                icon: 'success',
                confirmButtonText: 'Close'
              }).then(()=>this.getTicketList())
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

}
