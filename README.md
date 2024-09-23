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
7. 🚨 set the path of face Reco code and preprocessedImages folder name in config file
8. 🚨 set node env in env file test/deploy
9. make sure mongod is installed and is running
10. after that run following command
    "sudo systemctl enable mongod"
    "sudo chown -R mongodb:mongodb /var/lib/mongodb"
    "sudo chown -R 755 /var/lib/mongod"
    "sudo rm /var/lib/mongodb/mongod.lock
    "sudo systemctl daemon-reload"
    "sudo systemctl start mongod"
    "sudo systemctl enable mongod"
11. install it using npm i pm2 -g
12. start server with command "pm2 start index.js"
13. run command "pm2 save" and "pm2 startup"
