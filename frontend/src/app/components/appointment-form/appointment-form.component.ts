import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup;
  services = [
    'Loan Consultation',
    'Loan Application Submission',
    'Credit Card Inquiry',
    'Investment Consultation',
    'Project Funding Discussion',
    'VIP Customer Meeting',
    'Financial Advisory'
  ];
  minDate: string;
  isSubmitting = false;
   bookingSuccess = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.initForm();
  }

  ngOnInit(): void {}

  initForm(): void {
    this.appointmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      serviceType: ['', Validators.required],
      date: ['', Validators.required],
      message: ['']
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const appointment: Appointment = {
      ...this.appointmentForm.value,
      status: 'Pending'
    };

    this.appointmentService.createAppointment(appointment).subscribe({
      next: (response) => {
        this.successMessage = 'Appointment booked successfully!';
        this.bookingSuccess = true;
        this.appointmentForm.reset();
        setTimeout(() => {
          this.router.navigate(['/appointments']);
        }, 1500);
      },
      error: (error) => {
          console.error('Full error:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error response:', error.error);
          console.error('Error:', error);
        this.errorMessage = 'Error booking appointment. Please try again.';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  get formControls() {
    return this.appointmentForm.controls;
  }
}
