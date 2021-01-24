"use strict";
async function registrieren() {
    console.log("Sending form data.");
    let submitbutton = document.getElementById("NutzerDaten");
    let data = new FormData(submitbutton);
    //Daten in JSON Objekt schreiben
    let formData = JSON.stringify({ "fname": data.get("fname"),
        "lname": data.get("lname"),
        "strasseHauNr": data.get("strasseHauNr"),
        "postzahl": data.get("postzahl"),
        "stadt": data.get("stadt"),
        "email": data.get("email"),
        "passwort": data.get("passwort")
    });
    let response = await doRequest("", "POST", formData);
    document.getElementById("Message").innerHTML = response.statusText;
    console.log("Data sent.");
}
//Überprüfung der eingegebenen Daten mit den Daten in der Datenbank
async function einloggen() {
    console.log("sending login data");
    let submitbutton = document.getElementById("login");
    let data = new FormData(submitbutton);
    let formData = JSON.stringify({
        "email": data.get("email"),
        "passwort": data.get("passwort")
    });
    console.log("Form data: '" + formData + "'");
    let response = await doRequest("login", "POST", formData);
    document.getElementById("loginmeldung").innerHTML = response.statusText;
    console.log("Data sent.");
}
//Ausgabe der Datenbank
async function showUserlist() {
    let response = await doRequest("Namen", "GET", "");
    let namen = "";
    response.json().then(js => {
        for (let i = 0; i < js.length; i++) {
            //namen + fname + " " + lname + NEWLINE
            namen = namen + js[i].fname + " " + js[i].lname + "<br/>";
        }
        document.getElementById("Userliste").innerHTML = namen;
    });
}
//Allgemeine Methode zur Ausführung von Anfragen
async function doRequest(_pathName, _method, _body) {
    //Server URLs
    let serverUrl = "https://gisabgabewise2021.herokuapp.com/"; //Remote
    //let serverUrl: string = "http://localhost:8100/"; //Local
    let response;
    // GET Anfragen müssen ohne body und POST anfragen mit body gesendet werden
    if (_method === "GET") {
        response = fetch(serverUrl + _pathName, {
            method: _method,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    else {
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
//# sourceMappingURL=Client.js.map