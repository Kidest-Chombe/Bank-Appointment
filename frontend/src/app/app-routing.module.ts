import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';


export const routes: Routes = [
   { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full',
    data: { title: 'Home' }
  },
  { path: 'appointment-form', component: AppointmentFormComponent, data: { title: 'Book Appointment' } },
{ 
  path: 'appointments', 
  loadComponent: () => import('./components/appointment-list/appointment-list.component').then(m => m.AppointmentListComponent), 
  data: { title: 'My Appointments' } 
}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }