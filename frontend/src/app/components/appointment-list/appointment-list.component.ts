import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
   standalone: true, 
  selector: 'app-appointment-list',
  imports: [CommonModule,
     RouterModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  isLoading = true;

  constructor(private appointmentService: AppointmentService) {}

 ngOnInit() {
  console.log('Fetching appointments...');
  this.appointmentService.getAppointments().subscribe({
    next: (data) => {
      console.log('Received data:', data);
      this.appointments = data;
    },
    error: (err) => console.error('Error:', err)
  });
}

  loadAppointments(): void {
    this.isLoading = true;
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
        this.isLoading = false;
        
      }
    });
  }

  

  getStatusClass(status: 'Pending' | 'Confirmed' | 'Cancelled'): string {
    return {
      'Pending': 'bg-warning text-dark',
      'Confirmed': 'bg-success text-white',
      'Cancelled': 'bg-danger text-white'
    }[status];
  }

 cancelAppointment(id: number): void {
  this.appointmentService.updateAppointment(id, { status: 'Cancelled' })
    .subscribe({
      next: () => this.loadAppointments(),
      error: (err) => console.error('Failed to cancel:', err)
    });
}

  confirmAppointment(id: number): void {
  this.appointmentService.updateAppointment(id, { status: 'Confirmed' })
    .subscribe({
      next: (updatedAppt) => {
        const index = this.appointments.findIndex(a => a.id === id);
        if (index !== -1) {
          this.appointments[index] = updatedAppt;
        }
      }
    });
}
}