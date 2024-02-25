import { Component, OnInit } from '@angular/core';
import { TicketService } from '../tickets/Service/Ticket.service';
import { UsersService } from '../user/Service/users.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  allTickets: any[]; 
  ticketsEncours: any[]; 
  nombreUtilisateurs: number = 0; 
  nombreTechniciens: number = 0; 
  latestTickets: any[];

  constructor(
    private ticketService: TicketService,
    private userService: UsersService 
  ) {
    this.allTickets = [];
    this.latestTickets = [];
  }
  

  ngOnInit(): void {
    this.getTickets();
    this.getUsers(); 
  }
  
  createChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: ['Ouvert', 'En cours', 'Fermé'],
        datasets: [{
          label: 'Nombre de tickets par statut',
          data: [
            this.allTickets.filter(ticket => ticket.status === 'OPEN').length,
            this.allTickets.filter(ticket => ticket.status === 'INPROGRESS').length,
            this.allTickets.filter(ticket => ticket.status === 'CLOSED').length
          ],
          backgroundColor: [
            'rgba(0, 123, 255, 1)',
            'rgba(255, 193, 7, 1)',
            'rgba(40, 167, 69, 1)'
          ],
          borderColor: [
            'rgba(0, 123, 255, 1)',
            'rgba(255, 193, 7, 1)',
            'rgba(40, 167, 69, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false, // Ajout de cette option pour ne pas maintenir le ratio d'aspect
        responsive: true, // Permet au graphique de s'ajuster à la taille du conteneur
        aspectRatio: 1, // Réglez le ratio d'aspect du graphique
        scales: {
          r: {
            pointLabels: {
              font: {
                size: 12 // Ajustez la taille de la police des étiquettes
              }
            }
          }
        }
      }
    });
  }

  getTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (data: any[]) => {
        this.allTickets = data;
        this.ticketsEncours = data.filter(ticket => ticket.status !== 'CLOSED');
                // Extraire les 5 derniers tickets
                this.latestTickets = this.allTickets.slice(-10);
        this.createChart();
      },
      error: (error: any) => console.log(error)
    });
  }

  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: any[]) => {
        const users = data;
        this.nombreUtilisateurs = users.length;
        this.nombreTechniciens = users.filter(user => user.roles.some(role => role.name === 'ROLE_MODERATOR')).length;
      },
      error: (error: any) => console.log(error)
    });
  }

  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'primary';
      case 'INPROGRESS':
        return 'warning';
      case 'CLOSED':
        return 'success';
      default:
        return 'info';
    }
  }

  getFormattedStatus(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'Ouvert';
      case 'INPROGRESS':
        return 'En cours';
      case 'CLOSED':
        return 'Fermé';
      default:
        return status;
    }
  }
}
