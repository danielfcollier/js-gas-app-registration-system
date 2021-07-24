const fs = require("fs");
const path = require("path");

const dirNameServer = "server";
const dirNameClient = "client";
const dirNameGoogle = "gas";
const dirNameDist = "dist";

const dirDist= fs.readdirSync(path.resolve(__dirname, dirNameDist));

dirDist.forEach(file => {
    fs.copyFileSync(
        path.resolve(__dirname, dirNameDist, file),
        path.resolve(__dirname, dirNameGoogle, file)
    )
});

const dirServer = fs.readdirSync(path.resolve(__dirname, dirNameServer));

dirServer.forEach(file => {
    fs.copyFileSync(
        path.resolve(__dirname, dirNameServer, file),
        path.resolve(__dirname, dirNameGoogle, file)
    )
});