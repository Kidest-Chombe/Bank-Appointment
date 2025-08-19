import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Appointment } from '../models/appointment.model';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  
  private apiUrl = `${environment.apiBaseUrl}/appointments`;
    private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  createAppointment(appointment: Appointment): Observable<any> {
     console.log("Sending to:", this.apiUrl); 
  console.log("Payload:", appointment);    
    return this.http.post<Appointment>(this.apiUrl, appointment, { headers: this.headers })
    .pipe(
         catchError(error => {
      console.error("API Error:", error);
      throw error;
    })
      );
  }

  


  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl)
     .pipe(
        catchError(this.handleError)
      );
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`)
     .pipe(
        catchError(this.handleError)
      );
  }

  updateAppointment(id: number, updates: Partial<Appointment>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updates)
     .pipe(
        catchError(this.handleError)
      );
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
     .pipe(
        catchError(this.handleError)
      );
  }
   private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    throw new Error('Something went wrong; please try again later.');
  }
}