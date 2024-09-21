const chokidar = require('chokidar');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// Configuration for file watcher and server
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads'); // Adjust the path to the uploads folder
const SERVER_API = 'https://yourserver.com/upload'; // Replace with your server's upload API

// Function to upload a file to the server
async function uploadFile(filePath) {
    try {
        const fileStream = fs.createReadStream(filePath);
        const formData = new FormData();
        formData.append('file', fileStream, path.basename(filePath));

        // Sending the file to the server
        const response = await axios.post(SERVER_API, formData, {
            headers: formData.getHeaders(),
        });

        console.log(`File synced: ${filePath} -> Server`, response.data);
    } catch (error) {
        console.error(`Failed to sync file ${filePath}:`, error.message);
    }
}

// Function to delete a file from the server
async function deleteFile(filePath) {
    try {
        const fileName = path.basename(filePath);
        const response = await axios.delete(`${SERVER_API}/${fileName}`); // Adjust API route for deletion
        console.log(`File deleted from server: ${filePath} -> Server`, response.data);
    } catch (error) {
        console.error(`Failed to delete file ${filePath} from server:`, error.message);
    }
}

// Watch for changes in the uploads folder
function startFileWatcher() {
    const watcher = chokidar.watch(UPLOADS_DIR, {
        persistent: true,
        ignoreInitial: false,
        depth: 3,
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
