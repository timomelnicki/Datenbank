import * as Http from "http";
import * as fs from "fs";
import * as Mongo from "mongodb";

//Server aufsetzen
export namespace P_3_1Server {
    (async function(): Promise<void> {
        console.log("Starting server");
        let port: number = Number(process.env.PORT);
        if (!port)
            port = 8100;

        //Server starten, handle methoden definieren, Server connecten mit der Datenbank   
        let server: Http.Server = Http.createServer();
        server.addListener("request", handleRequest);
        server.addListener("listening", handleListen);
        server.listen(port);
        let url: string = "mongodb+srv://timo:timo1998@gisabgabe.wskcw.mongodb.net/Nutzer?retryWrites=true&w=majority";
        let options: Mongo.MongoClientOptions;
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(url, options);
        await mongoClient.connect();
        
        let dbconnection: Mongo.Collection = mongoClient.db("Nutzer").collection("Users");
        
        function handleListen(): void {
            console.log("Listening on port " + port);
        }

        //Request handler
        function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
            console.log("Received client request.");
            if (_request.method === "GET") {
                console.log("Request type: GET");
                handleGet(_request, _response);
            } else if (_request.method === "POST") {
                console.log("Request type: POST");
                handlePost(_request, _response);
            } 
        }
        //Post handler
        function handlePost(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
            let body: string = "";
            _request.on("data", data => {
                body += data;
            });
            //body daten zu JSON parsen
            _request.on("end", async () => {
                console.log("POST body data: '" + body + "'");
                console.log("Request URL: '"  + _request.url + "'");
                //wenn die url login ist findet ein Datenbank abgleich statt
                if (_request.url == "/login") {
                    console.log("Performing login.");
                    let result: Mongo.Collection = await dbconnection.findOne({"email": JSON.parse(body).email, "passwort": JSON.parse(body).passwort});
                    //bei erfolgreichem bzw falschem Abgleich dementsprechende Ausgabe
                    if (result) {
                        console.log("Login erfolgreich");
                        _response.writeHead(200, "Sie wurden erfolgreich eingeloggt", {
                            "Content-Type": "text/plain"
                        });
                    } else {
                        console.log("Ungültige Logindaten");
                        _response.writeHead(200, "Login fehlgeschlagen, bitte überprüfen Sie Ihre Eingabe", {
                            "Content-Type": "text/plain"
                        });
                    }
                } else {
                    //Abgleich bei der Registrierung, ob die Email schon vorhanden ist
                    console.log("Performing registration.");
                    let result: Mongo.Collection = await dbconnection.findOne({"email": JSON.parse(body).email});
                    if (result) {
                        console.log("Email already exists.");
                        _response.writeHead(200, "Email ist bereits vorhanden, bitte eine neue eingeben", {
                            "Content-Type": "text/plain"
                        });
                    } else {
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
            }) ;
        }
        //Get handler
        function handleGet(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
            console.log("Request: " + _request.url);
            //wenn die anfrage von der Namen url kam, werden alle Registrierten zurückgeschickt
            if (_request.url == "/Namen") {
                dbconnection.find({}, {projection: {_id: 0,
                                                    fname: 1,
                                                    lname: 1}})
                .toArray((error, result) => {
                    //bei Fehler entsprechende Meldung
                    if (error) {
                        console.log("Error: " + error);
                        _response.writeHead(500);
                        _response.write("Unerwarteter Fehler");
                    } else {
                        //Namen werden ausgegeben
                        console.log(result);
                        _response.writeHead(200, {"Content-Type": "text/html" });
                        _response.write(JSON.stringify(result));
                    }
                    _response.end();
                });
            }
            else {
                //Andere Getanfragen landen hier
                //Bei erstem verbinden muss der einzelne / zu Index (die Registrierung) umgewandelt werden
                if  (_request.url == "/") {
                    _request.url = "/Index.html";
                }
                //Jede Datei die angefragt wird, wird versucht zurückzuschicken
                fs.readFile("." + _request.url, (error, pgResp) => { //behandlung von error und pageresponse via lambda function
                    if  (error) {
                        //wenn es nicht alle zurückschicken konnte
                        console.log("Error when responding with"  + _request.url);
                        _response.writeHead(404);
                        _response.write("Contents you are looking are Not Found");
                    }   else {
                        //wenn es alle zurückschicken konnte
                        console.log("Successfully sent Response" +  _request.url);
                        _response.writeHead(200, {"Content-Type": "text/html" });
                        _response.write(pgResp);
                    }
                    _response.end(); 
                });
            }
        }
})();
}

