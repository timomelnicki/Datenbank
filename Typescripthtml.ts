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
    .catch (error => {
        console.error("Error: " + error);
        document.getElementById("Message").innerHTML = "unbekannter Fehler";
    });

    
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
    .catch (error => {
        console.error("Error: " + error);
        document.getElementById("loginmeldung").innerHTML = "unbekannter Fehler";
    });

    
    console.log("Data sent.");
}
//Ausgabe der Datenbank
async function showUserlist(): Promise<void> {
    fetch("https://gisabgabewise2021.herokuapp.com/Namen", {
        method: "GET",
        headers: {
        "Content-Type": "application/json"
        }
    })
    //Datenbank Inhalt in Arrays speichern für übersichtlichere Ausgabe
    .then(response => {
        console.log(response.statusText);
        let namen: string = "";
        response.json().then(js => {
            for (let i: number = 0; i < js.length; i++ ) {
                //namen + fname + " " + lname + NEWLINE
                namen = namen + js[i].fname + " " + js[i].lname + "<br/>";    
            }
            document.getElementById("Userliste").innerHTML = namen;
        });
        
        
    })
    //Meldung in der Konsole bei Fehler
    .catch (error => {
        console.error("Error: " + error);
        console.log("fehler");
    });
}