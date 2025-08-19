// api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

 
  getAppointments() {
    return this.http.get(`${this.apiUrl}/appointments`);
  }

 
  createAppointment(appointmentData: any) {
    return this.http.post(`${this.apiUrl}/appointments`, appointmentData);
  }
}