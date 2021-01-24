async function registrieren(): Promise<void> {
    console.log("Sending form data.");
    let submitbutton: HTMLFormElement = <HTMLFormElement> document.getElementById("NutzerDaten");
    let data: FormData = new FormData(submitbutton);
    
    //Daten in JSON Objekt schreiben
    let formData: string = JSON.stringify(
                            {"fname": data.get("fname") as string, 
                            "lname": data.get("lname") as string,
                            "strasseHauNr": data.get("strasseHauNr") as string,
                            "postzahl": data.get("postzahl") as string,
                            "stadt": data.get("stadt") as string,
                            "email": data.get("email") as string,
                            "passwort": data.get("passwort") as string
                            });

    let response: Response = await doRequest("", "POST", formData);
    document.getElementById("Message").innerHTML = response.statusText;

    console.log("Data sent.");
}
//Überprüfung der eingegebenen Daten mit den Daten in der Datenbank
async function einloggen(): Promise<void> {
    console.log("sending login data");
    let submitbutton: HTMLFormElement = <HTMLFormElement> document.getElementById("login");
    let data: FormData = new FormData(submitbutton);
    
    let formData: string = JSON.stringify(
                            {
                            "email": data.get("email") as string,
                            "passwort": data.get("passwort") as string
                            });

    console.log("Form data: '" + formData + "'");
    
    let response: Response = await doRequest("login", "POST", formData);
    document.getElementById("loginmeldung").innerHTML = response.statusText;
    
    console.log("Data sent.");
}



//Ausgabe der Datenbank
async function showUserlist(): Promise<void> {
    let response: Response = await doRequest("Namen", "GET", "");
    let namen: string = "";

    response.json().then(js => {
        for (let i: number = 0; i < js.length; i++ ) {
            //namen + fname + " " + lname + NEWLINE
            namen = namen + js[i].fname + " " + js[i].lname + "<br/>";    
        }
        document.getElementById("Userliste").innerHTML = namen;
    });
}

//Allgemeine Methode zur Ausführung von Anfragen
async function doRequest(_pathName: string, _method: string, _body: string): Promise<Response> {
    //Server URLs
    let serverUrl: string = "https://gisabgabewise2021.herokuapp.com/"; //Remote
    //let serverUrl: string = "http://localhost:8100/"; //Local
    
    let response: Promise<Response>;

    // GET Anfragen müssen ohne body und POST anfragen mit body gesendet werden
    if (_method === "GET") {
        response = fetch(serverUrl + _pathName, {
            method: _method,
            headers: {
            "Content-Type": "application/json"
            }
        });
    } else {
        response = fetch(serverUrl + _pathName, {
            method: _method,
            headers: {
            "Content-Type": "application/json"
            },
            body: _body
        });
    }
    return response;
}