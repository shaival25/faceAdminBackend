# 💻 Amfi backend (local)

This repo is for setting up backend for local systems used in each bus.

This repo will be used for storing user data such as kyc details,user analytics,face detections,person counter and heat maps in local database and syncing data with central server.

Steps to clone:

1. clone the repo
2. npm i (🚨 make sure you have 20 or 20+ version of node)
3. Create uploads folder in root directory
4. set .env file according to .env.example
5. get mac address of the system and store in env
6. set postmark api key
7. 🚨 change the path of the info.json in bnyGeneralController.js (saveBnyFormData) and set with path of the face detection code
8. 🚨 change the path in uploadFdImageMiddleware.js (saveToSecondLocation) and set with path of the preprocessed images path of the face detection code
9. make sure mongod is installed and is running
10. install it using npm i pm2 -g
11. start server with command "pm2 start index.js"
12. run command "pm2 save" and "pm2 startup"
