const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const os = require('os');

app.use(cors(  {origin: 'http://localhost:4200', // Your Angular app 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let appointments = [
  {
    id: 1,
    name: "Sample Customer",
    email: "sample@bank.com",
    serviceType: "Loan Consultation",
    date: "2024-05-20T10:00",
    status: "Confirmed"
  }
];

app.get('/connection-test', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Connection successful",
    serverTime: new Date().toISOString(),
    clientIP: req.ip,
    headers: req.headers
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Bank Appointment Backend is running!',
    endpoints: {
      bookAppointment: 'POST /api/appointments',
      getAppointments: 'GET /api/appointments',
      updateAppointment: 'PUT /api/appointments/:id',
      deleteAppointment: 'DELETE /api/appointments/:id'
    }
  });
});


app.post('/api/appointments', (req, res) => {
   console.log('Headers:', req.headers);
  console.log('Body:', req.body);
   console.log("Received:", req.body); 
  try {
    const { name, email, serviceType, date } = req.body;
    
 
    if (!name || !email || !serviceType || !date) {
      return res.status(400).json({ 
        success: false,
        error: "All fields are required: name, email, serviceType, date" 
      });
    }

    
    const conflict = appointments.some(appt => appt.date === date);
    if (conflict) {
      return res.status(409).json({
        success: false,
        error: "Time slot already booked"
      });
    }
        console.log('Received appointment:', req.body);
    const newAppointment = {
      id: Date.now(),
      name,
      email,
      serviceType,
      date,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);
    
    res.status(201).json({
      success: true,
      appointment: newAppointment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});


app.get('/api/appointments', (req, res) => {
  try {
    const { status } = req.query;
    
    let results = appointments;
    
    if (status) {
      results = appointments.filter(appt => appt.status === status);
    }
    
    res.status(200).json({
      success: true,
      count: results.length,
      appointments: results
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});


app.put('/api/appointments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Valid status is required: Pending, Confirmed, or Cancelled"
      });
    }
    
    const index = appointments.findIndex(appt => appt.id === Number(id));
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found"
      });
    }
    
    appointments[index].status = status;
    appointments[index].updatedAt = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      appointment: appointments[index]
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});


app.delete('/api/appointments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const initialLength = appointments.length;
    
    appointments = appointments.filter(appt => appt.id !== Number(id));
    
    if (appointments.length === initialLength) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully"
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
   console.log(`\x1b[32mServer successfully started on port ${PORT}\x1b[0m`);
  console.log(`Server ACTUALLY listening on port ${PORT}`);
  console.log('Try these commands:');
  console.log(`Test GET:  curl -X GET http://localhost:${PORT}`);
  console.log(`Test POST: curl -X POST http://localhost:${PORT}/api/appointments -H "Content-Type: application/json" -d "{\\"name\\":\\"Test\\"}"`);
  console.log(`API Documentation: http://localhost:${PORT}/`),
 console.log('\nAvailable network URLs:');
  Object.entries(os.networkInterfaces()).forEach(([name, interfaces]) => {
    interfaces.forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`- http://${iface.address}:${PORT}`);
      }
    });
  });

  console.log('\nTest commands:');
  console.log(`Local:  curl http://localhost:${PORT}`);
  console.log(`Remote: curl http://<your-ip>:${PORT}`);
})
.on('error', (err) => {
  console.error('\x1b[31mSERVER STARTUP FAILED:\x1b[0m', err);
 
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try:`);
    console.error(`1. netstat -ano | findstr :${PORT}`);
    console.error(`2. taskkill /pid <PID> /f`);
    console.error(`OR change PORT number in environment variables`);
  }
  
  process.exit(1);
});

