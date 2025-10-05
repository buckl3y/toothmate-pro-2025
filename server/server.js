const express = require('express');
const cors = require('cors');
const path = require('path');

// Commented out dotenv for development purposes
const dotenv = require('dotenv');
dotenv.config();

// Import and run straight away to get connection to db.
const sql = require("./utils/getConnection.js")(); 
async function connectToDatabase() {
    try {
        await sql.authenticate();
        console.log('Connection to database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error; // bubble up the error to exit if we cant find the database.
    }
}
connectToDatabase(); // Await doesn't work at top level.

require("./utils/databaseInit.js")(sql); // Set up models.

// This is what does all the http api stuff.
const app = express();
const PORT = process.env.PORT || 5000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Allow connections from the client or localhost. All others blocked.
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://oversky.net.nz:5005', 'http://oversky.net.nz:3000'],
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
