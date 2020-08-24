const express = require("express");
const bodyParser = require("body-parser");
const path = require ("path");
const mercadosAPI =require(path.join(__dirname,"./src/back/mercadosAPI"));

var app = express();

app.use(bodyParser.json());

mercadosAPI(app);

var port = process.env.PORT || 9999;

app.use("/", express.static("./public"));

app.listen(port, () => {
    console.log("Server ready on port " + port);
});

console.log("Starting server...");