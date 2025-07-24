const express = require('express');
const cors = require('cors');
const path = require('path');
// const dotenv = require('dotenv');
// dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Server is running correctly');
});

// Import routers
const xrayRouter = require('./routes/xray');
const patientRouter = require('./routes/patient');
const historyRouter = require('./routes/history');
const cautionRouter = require('./routes/caution');
const autofillRouter = require('./routes/autofill');
const teethRouter = require('./routes/teeth.ts');

// Use routers
app.use('/api', xrayRouter);
app.use('/api', patientRouter);
app.use('/api', historyRouter);
app.use('/api', cautionRouter);
app.use('/api', teethRouter);
app.use('/autofill', autofillRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});