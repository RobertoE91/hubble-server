const mongoose = require("mongoose");
const app = require("./app");
const https = require("https");
const fs = require("fs");

const port = process.env.SERVER_PORT;
const databaseUrl = process.env.DATABASE_URL;

let options = {};
if (process.env.TARGET === "deploy") {
    options.key = fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH);
    options.cert = fs.readFileSync(process.env.SSL_CERTIFICATE_PATH);
    options.ca = fs.readFileSync(process.env.SSL_CHAIN_PATH);
}

mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
});
mongoose.connection.on("error", console.error.bind(console, "[error] "));
mongoose.connection.once("open", function () {
    console.log("Database connection successfully established.");
    https.createServer(options, app).listen(port, () => {
        console.log("You can access the server at http://localhost:" + port);
    });
});
