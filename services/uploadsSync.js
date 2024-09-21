const chokidar = require('chokidar');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const FormData = require('form-data');
const config = require('../config/config');
require("dotenv").config();
const https = require('https');

const { checkInternet } = require('../helpers/internetHelper'); // Import the internet helper


// Configuration for file watcher and server
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const SERVER_API = process.env.API_BASE_URL + '/uploads/sync';

// HTTPS Agent to allow self-signed certificates
const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Accept self-signed certificates
});

// Function to upload a file to the server with retry mechanism
async function uploadFile(filePath, retries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Ensure the file exists before uploading
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }

            const isConnected = await checkInternet();
            if (!isConnected) {
                console.log('No internet connection. Retrying in 60 seconds...');
                await new Promise(res => setTimeout(res, 60000)); // Wait 60 seconds before retrying
                continue; // Retry the upload attempt
            }

            const fileStream = fs.createReadStream(filePath);
            const folderPath = path.relative(UPLOADS_DIR, path.dirname(filePath)) || '';

            // Handle file stream errors
            fileStream.on('error', (err) => {
                throw new Error(`Failed to read file: ${filePath}. Error: ${err.message}`);
            });

            const formData = new FormData();
            formData.append('file', fileStream, path.basename(filePath));
            formData.append('modifiedAt', new Date().toISOString()); // Include modified date
            formData.append('folderPath', folderPath); // Send the folder path


            // Send the file to the server with the API secret in headers
            const response = await axios.post(SERVER_API, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'x-auth-token': config.apiKey,
                },
                httpsAgent: httpsAgent, // For self-signed certificates
            });

            console.log(`File synced: ${filePath} -> Server`, response.data);
            return; // If successful, exit the function

        } catch (error) {
            console.error(`Failed to sync file ${filePath} on attempt ${attempt}: ${error.message}`);

            if (attempt < retries) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay)); // Delay before retrying
            } else {
                console.error(`Failed to sync file ${filePath} after ${retries} attempts.`);
            }
        }
    }
}

// Function to delete a file from the server with retry mechanism
async function deleteFile(filePath, retries = 3, delay = 1000) {
    const fileName = path.basename(filePath); // Extract filename from path
    const folderPath = path.relative(UPLOADS_DIR, path.dirname(filePath)); // Get the relative folder path

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Check for internet connectivity before deleting
            const isConnected = await checkInternet();
            if (!isConnected) {
                console.log('No internet connection. Retrying in 60 seconds...');
                await new Promise(res => setTimeout(res, 60000)); // Wait 60 seconds before retrying
                continue; // Retry the deletion attempt
            }

            const response = await axios.delete(`${SERVER_API}/delete`, {
                data: { fileName, folderPath },
                headers: {
                    'x-auth-token': config.apiKey, // API secret
                },
                httpsAgent: httpsAgent, // For self-signed certificates
            });

            console.log(`File deleted from server: ${filePath} -> Server`, response.data);
            return; // Exit the function if successful

        } catch (error) {
            console.error(`Failed to delete file ${filePath} on attempt ${attempt}: ${error.message}`);

            if (attempt < retries) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay)); // Delay before retrying
            } else {
                console.error(`Failed to delete file ${filePath} after ${retries} attempts.`);
            }
        }
    }
}

// Watch for changes in the uploads folder
function startFileWatcher() {
    const watcher = chokidar.watch(UPLOADS_DIR, {
        persistent: true,
        ignoreInitial: false, // Start watching from the initial state
        depth: 3, // Watch subdirectories up to a depth of 3
    });

    watcher
        .on('add', (filePath) => {
            console.log(`New file added: ${filePath}`);
            uploadFile(filePath); // Sync new file
        })
        .on('change', (filePath) => {
            console.log(`File changed: ${filePath}`);
            uploadFile(filePath); // Sync modified file
        })
        .on('unlink', (filePath) => {
            console.log(`File deleted: ${filePath}`);
            deleteFile(filePath); // Sync deletion
        })
        .on('error', (error) => {
            console.error('Watcher error:', error);
        });

    console.log(`Watching for file changes in ${UPLOADS_DIR}...`);
}

// Export the watcher function so it can be started elsewhere
module.exports = {
    startFileWatcher,
};
