export interface Appointment {
  id: number;
  name: string;
  email: string;
  serviceType: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt?: string;
  updatedAt?: string;
}