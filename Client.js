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
    //Daten der Registrierung übermitteln
    console.log("Form data: '" + formData + "'");
    fetch("https://gisabgabewise2021.herokuapp.com/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: formData
    })
        //Bestätigung wenn es geklappt hat
        .then(response => {
        console.log(response.statusText);
        document.getElementById("Message").innerHTML = response.statusText;
    })
        //Error code wenn es fehlgeschlagen ist
        .catch(error => {
        console.error("Error: " + error);
        document.getElementById("Message").innerHTML = "unbekannter Fehler";
    });
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
    fetch("https://gisabgabewise2021.herokuapp.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: formData
    })
        //Nachricht bei erfolgreichem login
        .then(response => {
        console.log(response.statusText);
        document.getElementById("loginmeldung").innerHTML = response.statusText;
    })
        //Error code bei Fehler
        .catch(error => {
        console.error("Error: " + error);
        document.getElementById("loginmeldung").innerHTML = "unbekannter Fehler";
    });
    console.log("Data sent.");
}
//Ausgabe der Datenbank
async function showUserlist() {
    fetch("https://gisabgabewise2021.herokuapp.com/Namen", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        //Datenbank Inhalt in Arrays speichern für übersichtlichere Ausgabe
        .then(response => {
        console.log(response.statusText);
        let namen = "";
        response.json().then(js => {
            for (let i = 0; i < js.length; i++) {
                //namen + fname + " " + lname + NEWLINE
                namen = namen + js[i].fname + " " + js[i].lname + "<br/>";
            }
            document.getElementById("Userliste").innerHTML = namen;
        });
    })
        //Meldung in der Konsole bei Fehler
        .catch(error => {
        console.error("Error: " + error);
        console.log("fehler");
    });
}
//# sourceMappingURL=Client.js.map