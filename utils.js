const fs = require("fs");
const path = require("path");

const dirNameServer = "server";
const dirNameClient = "client";
const dirNameGoogle = "gas";

const htmlFile = "index.html";

fs.copyFileSync("./dist/index.html", "./gas/index.html");

const dirServer = fs.readdirSync(path.resolve(__dirname, dirNameServer));

dirServer.forEach(file => {
    fs.copyFileSync(
        path.resolve(__dirname, dirNameServer, file),
        path.resolve(__dirname, dirNameGoogle, file)
    )
});