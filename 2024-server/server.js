const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: ['http://localhost:3000', 'https://two024-toothmate-client.onrender.com'],
}));

app.use(express.json());

// Import routers
const xrayRouter = require('./routes/xray');
const patientRouter = require('./routes/patient');
const historyRouter = require('./routes/history');
const cautionRouter = require('./routes/caution');
const autofillRouter = require('./routes/autofill');

// Use routers
app.use('/api', xrayRouter);
app.use('/api', patientRouter);
app.use('/api', historyRouter);
app.use('/api', cautionRouter);
app.use('/autofill', autofillRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
