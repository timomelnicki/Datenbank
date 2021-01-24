"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P_3_1Server = void 0;
const Http = require("http");
const fs = require("fs");
const Mongo = require("mongodb");
//Server aufsetzen
var P_3_1Server;
(function (P_3_1Server) {
    (async function () {
        console.log("Starting server");
        let port = Number(process.env.PORT);
        if (!port)
            port = 8100;
        //Server starten, handle methoden definieren, Server connecten mit der Datenbank   
        let server = Http.createServer();
        server.addListener("request", handleRequest);
        server.addListener("listening", handleListen);
        server.listen(port);
        let url = "mongodb+srv://timo:timo1998@gisabgabe.wskcw.mongodb.net/Nutzer?retryWrites=true&w=majority";
        let options;
        let mongoClient = new Mongo.MongoClient(url, options);
        await mongoClient.connect();
        let dbconnection = mongoClient.db("Nutzer").collection("Users");
        function handleListen() {
            console.log("Listening on port " + port);
        }
        //Request handler
        function handleRequest(_request, _response) {
            console.log("Received client request.");
            if (_request.method === "GET") {
                console.log("Request type: GET");
                handleGet(_request, _response);
            }
            else if (_request.method === "POST") {
                console.log("Request type: POST");
                handlePost(_request, _response);
            }
        }
        //Post handler
        function handlePost(_request, _response) {
            let body = "";
            _request.on("data", data => {
                body += data;
            });
            //body daten zu JSON parsen
            _request.on("end", async () => {
                console.log("POST body data: '" + body + "'");
                console.log("Request URL: '" + _request.url + "'");
                //wenn die url login ist findet ein Datenbank abgleich statt
                if (_request.url == "/login") {
                    console.log("Performing login.");
                    let result = await dbconnection.findOne({ "email": JSON.parse(body).email, "passwort": JSON.parse(body).passwort });
                    //bei erfolgreichem bzw falschem Abgleich dementsprechende Ausgabe
                    if (result) {
                        console.log("Login erfolgreich");
                        _response.writeHead(200, "Sie wurden erfolgreich eingeloggt", {
                            "Content-Type": "text/plain"
                        });
                    }
                    else {
                        console.log("Ungültige Logindaten");
                        _response.writeHead(200, "Login fehlgeschlagen, bitte überprüfen Sie Ihre Eingabe", {
                            "Content-Type": "text/plain"
                        });
                    }
                }
                else {
                    //Abgleich bei der Registrierung, ob die Email schon vorhanden ist
                    console.log("Performing registration.");
                    let result = await dbconnection.findOne({ "email": JSON.parse(body).email });
                    if (result) {
                        console.log("Email already exists.");
                        _response.writeHead(200, "Email ist bereits vorhanden, bitte eine neue eingeben", {
                            "Content-Type": "text/plain"
                        });
                    }
                    else {
                        //Datenbank eintrag erstellen
                        console.log("Email doesn't exist. Created new entry.");
                        _response.writeHead(200, "Erfolgreich Registriert!", {
                            "Content-Type": "text/plain"
                        });
                        dbconnection.insertOne(JSON.parse(body)); //insert laut der documentation ist veraltet
                    }
                }
                _response.end();
                console.log("Post response: 200 OK");
            });
        }
        //Get handler
        function handleGet(_request, _response) {
            console.log("Request: " + _request.url);
            //wenn die anfrage von der Namen url kam, werden alle Registrierten zurückgeschickt
            if (_request.url == "/Namen") {
                dbconnection.find({}, { projection: { _id: 0,
                        fname: 1,
                        lname: 1 } })
                    .toArray((error, result) => {
                    //bei Fehler entsprechende Meldung
                    if (error) {
                        console.log("Error: " + error);
                        _response.writeHead(500);
                        _response.write("Unerwarteter Fehler");
                    }
                    else {
                        //Namen werden ausgegeben
                        console.log(result);
                        _response.writeHead(200, { "Content-Type": "text/html" });
                        _response.write(JSON.stringify(result));
                    }
                    _response.end();
                });
            }
            else {
                //Andere Getanfragen landen hier
                //Bei erstem verbinden muss der einzelne / zu Index (die Registrierung) umgewandelt werden
                if (_request.url == "/") {
                    _request.url = "/Index.html";
                }
                //Jede Datei die angefragt wird, wird versucht zurückzuschicken
                fs.readFile("." + _request.url, (error, pgResp) => {
                    if (error) {
                        //wenn es nicht alle zurückschicken konnte
                        console.log("Error when responding with" + _request.url);
                        _response.writeHead(404);
                        _response.write("Contents you are looking are Not Found");
                    }
                    else {
                        //wenn es alle zurückschicken konnte
                        console.log("Successfully sent Response" + _request.url);
                        _response.writeHead(200, { "Content-Type": "text/html" });
                        _response.write(pgResp);
                    }
                    _response.end();
                });
            }
        }
    })();
})(P_3_1Server = exports.P_3_1Server || (exports.P_3_1Server = {}));
//# sourceMappingURL=Server.js.map