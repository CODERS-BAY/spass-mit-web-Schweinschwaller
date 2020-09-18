//####################################//
//   Globale Variablen                //
//####################################//

// Radio button fixed
function isPC() {
	document.getElementById("combatantPC").checked = true;
	document.getElementById("combatantNPC").checked = false;
}
function isNPC() {
	document.getElementById("combatantNPC").checked = true;
	document.getElementById("combatantPC").checked = false;
}   

// Schaltet im Setupteil der Combat Seite den Statusteil Sichtbar oder blendet ihn aus
var showStatus = false;
var statusBtn = document.getElementById("statusBtn");
var statusPart = document.getElementById("combatsetupstatus");
var addCBtn = document.getElementById("addCBtn");

// Schaltet den Setupteil der Combat Seite Sichtbar oder blendet ihn aus
var showSetup = true;
var setupBtn = document.getElementById("setupBtn");
var setupPart = document.getElementById("combatsetup");
   
// Array aus Strings für den Status Namen
var statusArrayName = [ "Blinded", "Charmed", "Deafened", "Frightened", "Grappled",
						"Incapacitated", "Invisible", "Paralyzed", "Petrified",
						"Poisoned", "Prone", "Restrained", "Stunned","Unconscions"];

// Alle Checkboxen die für den Status angelegt wurden
var statusElements = document.getElementsByClassName("status");

// Ein Array für die Combatant Objekte
var arrayCombatant = [{	cName: "Platzhalter",
						ini: -1,
						ac: -1,
						maxHP: -1,
						cHP: -1,
						statusArray: [false, false, false, false, false, false, false, false, false, false, false, false, false, false],
						isPC: false
					}];

// Zur bestimmun welcher Combatant der Aktive ist
var activCombatant = 1;

// Alle Paragraphs für die Ausgabe der Combatanten
var countCombatant = document.getElementsByClassName("demoCombatant");
var countCombatantRange = document.getElementsByClassName("demoCombatantRange");
var countCombatantRangeOut = document.getElementsByClassName("demoCombatantRangeOut");
        
// Die maximale Anzahl der Combatanten die angezeigt werden können.
var maxCombatant = countCombatant.length;

// Status für changeStatus
var pausedForChange = false;

// der Selcetor für die Combatanten beim Change Status
var selcectCombatant = document.getElementById("selectCombatant");

// Test DATEN -  Lösen wenn fertig mit TEST
//##########################################################################
var testCombantant = {	cName: "Garak", ini: 10, ac: 15, maxHP: 41, cHP: 14, 
						statusArray: [false, true, false, false, false, false, false, false, false, false, false, false, false, false],
						isPC: true};
	arrayCombatant.push(testCombantant);

	testCombantant = {	cName: "Yang", ini: 19, ac: 18, maxHP: 61, cHP: 50,
						statusArray: [false, false, false, false, false, false, false, false, false, false, false, false, false, false],
						isPC: true};
    arrayCombatant.push(testCombantant);

    testCombantant = {	cName: "Deadro", ini: 15, ac: 15, maxHP: 55, cHP: 55,
						statusArray: [false, false, false, false, false, false, false, false, false, false, false, false, false, true],
						isPC: true};
    arrayCombatant.push(testCombantant);

    testCombantant = {	cName: "Ork", ini: 22, ac: 18, maxHP: 100, cHP: 55,
						statusArray: [false, false, false, false, false, true, false, false, false, false, false, false, false, false],
						isPC: false};
    arrayCombatant.push(testCombantant);

    testCombantant = {	cName: "Goblin", ini: 9, ac: 20, maxHP: 70, cHP: 70,
						statusArray: [true, false, false, false, false, false, false, false, false, false, false, false, false, true],
						isPC: false};
    arrayCombatant.push(testCombantant);

    testCombantant = {	cName: "TEST", ini: 10, ac: 1, maxHP: 1, cHP: 1,
						statusArray: [true, true, true, true, true, true, true, true, true, true, true, true, true, true],
						isPC: false};
    arrayCombatant.push(testCombantant);

    console.log(arrayCombatant);
//##########################################################################

//####################################//
//   Funktionen                       //
//####################################//

// Schaltet im Setupteil der Combat Seite den Statusteil Sichtbar oder blendet ihn aus
function statusON() {
	showStatus = true;
	// Setup Einstellungen Anzeigen
	statusPart.style.display = "block";
    // Setup Botton umbenennen
    statusBtn.innerText = "Hidde status option";
}
function statusOFF() {
	showStatus = false;
    // Setup Einstellungen nicht Anzeigen
    statusPart.style.display = "none";
    // Setup Botton umbenennen
    statusBtn.innerText = "Show status option";
}
function statusToggle() {
	if (showStatus) {
		statusOFF();
	} else {
		statusON();
	}
}

// Ein und Ausblenden des Setupteils
function setupON() {
	showSetup = true;
	// Setup Einstellungen Anzeigen
    setupPart.style.display = "block";
    statusBtn.style.display = "block";
    addCBtn.style.display = "block";
    setupPart.style.display = "block";
    // Setup Botton umbenennen
    setupBtn.innerText = "Hidde setup";
    //Anzeige Änderung
    document.getElementById("startCBtn").style.display = "block";
    document.getElementById("nextTurnBtn").style.display = "none";
    document.getElementById("changeStatusBtn").style.display = "none";
}
function setupOFF() {
	showSetup = false;
    // Setup Einstellungen nicht Anzeigen
    setupPart.style.display = "none";
    statusBtn.style.display = "none";
    addCBtn.style.display = "none";
    setupPart.style.display = "none";
    // Setup Botton umbenennen
    setupBtn.innerText = "Show setup";
}
function setupToggle() {
	if (showSetup) {
		setupOFF();
	} else {
		setupON();
	}
}

/*  combatantSort soll die Objekte im Array nach ihrer ini sortieren. Dabei aber den Platzhalter ignorieren.
	Es wird nach dem Objekt mit der höchsten ini gesucht. (durch gang von 1 bis .length vom arrayCombatant)
	jetzt wird das zu ersetztende Objekt (1 beim ersten durchgang) zwischen gespeichert
	dann wird das Objekt mit der höchsten ini auf die zu ersetztende position geschrieben (1 beim ersten durchgang)
	und anschließend das gespeicherte Objekt auf der Position des gefunden(das zuvor gefundene objekt)

            Beispiel:
            Array: -1|11|20|19|22|9  ihelp: -1
            suchergebnis=22 --> ihelpIndex = 4, ihelp = 5
            Array: -1|22|20|19|11|9
            .... 
*/
function combatantSort() {
// Erstellen eines Hilf Objekts das mit den Werten des Platzhalters erstellt werden
	var objHelp = arrayCombatant[0];

    var iHelp;
    var iHelpIndex = 0;

    // Überprüfen ob der Array mindestens 2 Objekte hat die sortiert werden sollen
    if (arrayCombatant.length > 1) { 
	// es wird das Array durch gegangen vom Index 1 beginnend. => Platzhalter bleibt auf Position 0
		for (i = 1; i < arrayCombatant.length-1; i++) {
			// iHelp soll das element mit der größten ini finden
			iHelp = -10;
            // Durchsuchen aller noch nicht sortierten Objekte
            for (j = i; j < arrayCombatant.length; j++) {
				if (iHelp < arrayCombatant[j].ini) {
					iHelp = arrayCombatant[j].ini;
                    // iHelpIndex ist die Position des Objekts mit der größten ini 
                    iHelpIndex = j;
				}
			}        
            // vom 1 beginnend wird das zu ersetzende objekt gespeichert
            objHelp = arrayCombatant[i];
                   
            // das Objekt mit der höchsten ini wird nun an die zu ersetzende Stelle gesetzt
            arrayCombatant[i] = arrayCombatant[iHelpIndex];

            // das Objekt das ersetzt wurde wird nun an den platz des Objektes gesetzt das es ersetzt hat
            arrayCombatant[iHelpIndex] = objHelp;
        }
    }
}

// entfernt die toten Combatanten aus dem arrayCombatant (Nur die toten haben das End des Krieges gesehen)
function removeDead() {
	var iHelp = 0;

	for (i=1; i < arrayCombatant.length; i++) {
		if (arrayCombatant[i].cHP == 0) {
			// der Tote Combatant wird mit Platzhalter überschrieben == TOT
            arrayCombatant[i] = arrayCombatant[0];

            // zählt wieviele Combatanten die bis einschließlich dem activen entfernt werden
            if( i <= activCombatant) {
				iHelp++;
            }
        }
    }
	// setzt den activCombatant Index neu um die Änderungen zu kompensieren 
	activCombatant -= iHelp;

    // sortieren des ArrayCombatant damit alle TOTEN am ende des Array sind.
    combatantSort();

    for(i = arrayCombatant.length-1; i > 0; i--) {
        // alle toten Combatanten werden entfernt
        if(arrayCombatant[i].maxHP == -1) {                    
			// die Letzte stelle wird gelöst
            arrayCombatant.pop();
            countCombatant[arrayCombatant.length].style.display = "none";
            countCombatantRange[arrayCombatant.length].style.display = "none";
            countCombatantRangeOut[arrayCombatant.length].style.display = "none";
        }   
    }
}

// Reloaded die Änderungen in die Anzeige neu laden
function reload() {
	// die toten combatant werden entfernt  (don't dead open Inside)
    removeDead();

    for (i = 1; i < maxCombatant && i< arrayCombatant.length; i++) { 
		//Laden des Combatanten Objects in eine String
        strHelp = arrayCombatant[i].ini + 
				": " + arrayCombatant[i].cName + 
				"\nAC: " + arrayCombatant[i].ac + 
				"\tHP: " + arrayCombatant[i].cHP + "\\" + arrayCombatant[i].maxHP + 
				"\nStatus: " ; 

		// Alle Statuseffekte werden hier hinzugefügt wenn aktiv 
        for (j=0; j < statusArrayName.length; j++) { 
            if (arrayCombatant[i].statusArray[j] == true) {
                strHelp +=statusArrayName[j] + " " ; 
            } 
        } 
        strHelp +="\n" ; 
                
        // der Paragraph wird mit dem str gefüllt und auf sichtbar geschaltet
        countCombatant[i].innerHTML = strHelp; 
                
        countCombatantRange[i].max = arrayCombatant[i].maxHP;
        countCombatantRange[i].value = arrayCombatant[i].cHP;
    }
}

// Fügt eine Combatanten zum Array hinzu.
function addCombatant() {
	// Array aus boolean für den Status
    var statusArrayHelp = [false, false, false, false, false, false, false, false, false, false, false, false, false, false];

	for (i in statusArrayHelp) {
		statusArrayHelp[i] = statusElements[i].checked; //TODO: Checkboxen zurücksetzen oder nicht?? Wenn dann hier
	}
    // wenn bei Leeren formula gedrückt wird --> abfangen
    if(document.getElementById("combatantIni").value <= 0) {
		window.alert("Invalid initative!");
    } else {
	// füllen eines Combatant Objekts
	var newCombantant = {	cName: document.getElementById("combatantName").value,
							ini: document.getElementById("combatantIni").value,
							ac: document.getElementById("combatantAC").value,
							maxHP: document.getElementById("combatantMaxHp").value,
							cHP: document.getElementById("combatantCurrentlyHp").value,
							statusArray: statusArrayHelp,
							isPC: document.getElementById("combatantPC").checked };

	// Spezial Fall wenn kein Name angegeben dann ist --> name = "unnamed"
    if(document.getElementById("combatantName").value == "") {
		newCombantant.cName = "unnamed";
    }

	// Spezial Fall wenn keine Max HP angegeben sind --> max HP = 1
	if(document.getElementById("combatantMaxHp").value <= 0 ) {
		newCombantant.maxHP = 1;
    }

    // Spezial Fall wenn Currently HP nicht ausgefüllt wird => currently HP = MAX HP
    if(	document.getElementById("combatantCurrentlyHp").value <= 0 || document.getElementById("combatantCurrentlyHp").value >= document.getElementById("combatantMaxHp").value) {
		newCombantant.cHP = newCombantant.maxHP;
	}

    // Objekts in Array der Combantanten speichern
    arrayCombatant.push(newCombantant);

    // Alle Setup Daten wieder auf Null
    document.getElementById("combatantName").value = "";
    document.getElementById("combatantIni").value = null;
    document.getElementById("combatantAC").value = null;
    document.getElementById("combatantMaxHp").value = null;
    document.getElementById("combatantCurrentlyHp").value = null;
    }
}

// Beendet das Setup und stellt alle Combatanten dar.
function startCombatant() {
	// Anzeige Änderung
	document.getElementById("startCBtn").style.display = "none";
    document.getElementById("nextTurnBtn").style.display = "block";
    document.getElementById("changeStatusBtn").style.display = "block";
    statusOFF();
    setupOFF();

    // Sortien der Combatanten nach ini
    combatantSort();
            
    var strHelp;
        
    for (i = 1; i < maxCombatant && i< arrayCombatant.length; i++) {
		//Laden des Combatanten Objects in eine String
        strHelp = arrayCombatant[i].ini +
				": " + arrayCombatant[i].cName +
                "\nAC: " + arrayCombatant[i].ac +
                "\tHP: " + arrayCombatant[i].cHP + "\\" + arrayCombatant[i].maxHP +
                "\nStatus: ";

		// Alle Statuseffekte werden hier hinzugefügt wenn aktiv
        for (j = 0; j < statusArrayName.length; j++) {
			if (arrayCombatant[i].statusArray[j] == true) {
				strHelp += statusArrayName[j] + " ";
			} 
		}
		strHelp += "\n";
        // der Paragraph wird mit dem str gefüllt und auf sichtbar geschaltet
        countCombatant[i].innerHTML = strHelp;
        countCombatant[i].style.display = "block";

        countCombatantRange[i].max = arrayCombatant[i].maxHP;
        countCombatantRange[i].value = arrayCombatant[i].cHP;
        countCombatantRange[i].style.display = "inline";

        countCombatantRangeOut[i].style.display = "inline";
    }
	// Aktiver Combatant einfärben
    countCombatant[activCombatant].style.backgroundColor = "lightgray";
}

// Ändert die Anzeige für den nächsten zug
function nextTurn() {
	//Anzeige des Aktiven Combatant ändern
    countCombatant[activCombatant].style.backgroundColor = "transparent";

    // Lebenspunkte aktualisieren
    for(i=1; i < maxCombatant && i < arrayCombatant.length; i++) {
		arrayCombatant[i].cHP=countCombatantRange[i].value; 
    } 
    // führt Aktualisierung durch.
    reload();

    if(activCombatant < (arrayCombatant.length-1)) { 
		// zähler welcher Combatant drann ist (Index von arrayCombatant)
		activCombatant++; 
        //combatRoundCounter++; //TODO: optional falls man Runden zählen will 
	} else {
		// die runde startet wieder beim ersten
		activCombatant = 1; 
	}
    countCombatant[activCombatant].style.backgroundColor="lightgray";
}

// zum Status ändern wärend des Kampfes
function selectReloadStatus() {
	for(i=1; i < arrayCombatant.length ;i++) {
		if(selectCombatant.value == arrayCombatant[i].cName) {
			for (j=0; j < arrayCombatant[1].statusArray.length ;j++) {
				statusElements[j].checked = arrayCombatant[i].statusArray[j]; 
            }
			break;
        }
	}  
}
function changeStatus() {
	if(pausedForChange) {
		//Speichern der Änderungen
        for(i=1; i < arrayCombatant.length ;i++) { 
			if(selectCombatant.value == arrayCombatant[i].cName) { 
				for(j=0; j < arrayCombatant[1].statusArray.length ;j++) {
					arrayCombatant[i].statusArray[j]=statusElements[j].checked;
                }
			break; 
            } 
		}
        reload();

        // Fortführen des Combat
        pausedForChange = false;
        // Status
        statusOFF();

        // Anzeige Änderung
        document.getElementById("nextTurnBtn").style.display = "block";
        setupBtn.style.display = "block";
        document.getElementById("changeStatusBtn").innerText = "change status";
        document.getElementById("combatsetupstatuschange").style.display = "none";
	} else {
		// Pausieren des Combat
		pausedForChange = true;
        statusON();

        // Anzeige Änderung
        document.getElementById("nextTurnBtn").style.display = "none";
        setupBtn.style.display = "none";
        document.getElementById("combatsetupstatuschange").style.display = "block";
        document.getElementById("changeStatusBtn").innerText = "Save and return";
                
        // alles alte löschen - falls bisher Combatanten entfernt wurden
        for(i=selcectCombatant.length-1; i > 0;i--) {
			selcectCombatant.remove(i);
		}
                
        // befüllen des selcetor mit den aktiven Combatanten
        for(i=1;i < arrayCombatant.length; i++) {  
			var option = document.createElement("option");
            option.text = arrayCombatant[i].cName
            selectCombatant.add(option);
		}
                
        // Setzen der Status Flags für die erste option
        for (i=0; i < arrayCombatant[1].statusArray.length ;i++) {
			statusElements[i].checked = arrayCombatant[1].statusArray[i]; 
		}
	}
}