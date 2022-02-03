// ENVIRONMENT VARIABLES (.env file)
/*
APP_KEY=YOUR_KEY
SERVER_PORT=YOUR_PORT_NUMBER
FRONTEND_FOLDER=build
MONGO_URL=mongodb://localhost:27017/github
DROPBOX_TOKEN=YOUR_DROPBOX_TOKEN
EMAIL_ADDRESS=YOUR_EMAIL
EMAIL_PASSWWORD=YOUR_EMAIL_PASSWORD
*/

// CREATE USER PASSWORD
const bcrypt = require("bcrypt");
const password = "12345678";
const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password, salt);
console.log("PASS", hashed);

// MONGODB
// --> "data" src-backend/extra/collection.data.json
// --> "users" src-backend/extra/collection.users.json
