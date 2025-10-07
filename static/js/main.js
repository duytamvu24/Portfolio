//1 Laden der JSON Daten

fetch('/static/data/projects.json')
.then(response => response.json())
.then(data => {
    data.forEach(project => {
        console.log(project.titel, project.description);
        add_project_to_site(project);
    })
})

window.addEventListener('load', adjustaboutmeTop);
window.addEventListener('resize', adjustaboutmeTop);

function adjustaboutmeTop() {
    const menuHeight = document.querySelector('.menu').offsetHeight;
    console.log(menuHeight);
    document.querySelector('.aboutme').style.marginTop = `${menuHeight - 50}px`;
}

// Shadow for black keys
document.addEventListener('mousemove', (e) => {
    const piano = document.querySelector('.piano');
    const black_keys = document.querySelectorAll('.key.black');
    const piano_width = piano.getBoundingClientRect().width;
    const piano_height = piano.getBoundingClientRect().height;

    let x_offset = -((e.x - piano_width/2) / (100)) ;
    let y_offset = -((e.y - piano_height/2) / (15)) ;
    black_keys.forEach(key =>{
        if(y_offset<0){
            y_offset = 0;
        };
        key.style.boxShadow = `${x_offset}px ${y_offset}px 10px rgba(0,0,0, 0.7)`;
    })
});
const audioMap = {};
//Add sound for every key
async function add_sound_for_every_key(){
    const piano_wrapper = document.getElementById('piano_wrapper');
    const all_keys = document.querySelectorAll('.key');
    let mouseDown = false;

    document.addEventListener('mousedown', () => {
        mouseDown = true;
    });

    document.addEventListener('mouseup', () => {
        mouseDown = false;
    });

    piano_wrapper.addEventListener('mouseleave', () =>{
        if(mouseDown){
            mouseDown = false;
        }
    });

    all_keys.forEach(key => {
        let note = key.dataset.note;
        let audio = new Audio(`/static/keys/${note}.ogg`);
        audioMap[note] = audio;
        // Beim direkten Drücken
        key.addEventListener('mousedown', () => {
            triggerKey(key);
        });

        // Wenn Maus drüberfährt und gedrückt ist
        key.addEventListener('mouseover', () => {
            
            if (mouseDown) {
                triggerKey(key);
            }
        });

        // Optional: Rücksetzung beim Loslassen
        key.addEventListener('mouseup', () => {
            releaseKey(key);
        });

        key.addEventListener('mouseleave', () => {
            releaseKey(key);
        });
    });
};

//piano up

document.getElementById('piano_trigger').addEventListener('click', () => {
  const piano = document.querySelector('.piano');
  piano.classList.toggle('expanded');  
  const trigger = document.getElementById('piano_trigger');
  if(trigger.textContent === "up"){
    trigger.textContent = "down";
  } else {
    trigger.textContent = "up";
  }
});


// Funktionen zum Auslösen und Zurücksetzen
function triggerKey(key) {
    let note = key.dataset.note;
    audio = audioMap[note];
    key.classList.add('active');
    if (audio) {
        audio.currentTime = 0; // Zurückspulen bei erneutem Drücken
        audio.play();
    }
    // Optional: Sound oder andere Effekte
    console.log('Taste gedrückt:', key.dataset.note);
}

function releaseKey(key) {
    let note = key.dataset.note;
    let audio = audioMap[note];
    
    // Farbe sofort entfernen
    key.classList.remove('active');
    
    if (audio) {
        // Ton nach 400ms stoppen
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;  // optional zurücksetzen, falls neu starten soll
        }, 400);
    }
}

add_sound_for_every_key();


// Play Chords:
function play_chords(key1, key2, key3){
    console.log("spiele Akkord");
    console.log(key1, key2, key3);
    const chord = [key1, key2, key3];
    for (let key of chord){
        let key_piano = document.querySelector(`.key[data-note="${key}"]`);
        const audio = audioMap[key];
        if (key_piano) {
            key_piano.classList.add('active');

            // Entferne .active nach z. B. 200ms
            setTimeout(() => {
                key_piano.classList.remove('active');
            }, 200);
        }

        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    }
}

async function add_project_to_site(project) {
    const project_portfolio = document.getElementById("project_portfolio");
    const project_feed = document.createElement("div");
    project_feed.classList.add("project");

    // Titel
    const project_title = document.createElement("div");
    project_title.classList.add("project_title");
    project_title.textContent = project.titel;

    // Body
    const project_body = document.createElement("div");
    project_body.classList.add("project_body");

    // Bild
    const project_image = document.createElement("div");
    project_image.classList.add("project-image");
    const img = document.createElement("img");
    img.src = "/static/index/" + project.img_url;
    console.log("/static/index/" + project.img_url);
    img.alt = project.titel;
    project_image.appendChild(img);

    // Beschreibung
    const project_info = document.createElement("div");
    project_info.classList.add("project_description");
    project_info.textContent = project.description;

    // Struktur zusammensetzen
    project_body.appendChild(project_image);
    project_body.appendChild(project_info);

    project_feed.appendChild(project_title);
    project_feed.appendChild(project_body);

    // Klick zum Öffnen
    project_feed.addEventListener('click', () => {
        window.open('/project/' + project.url.replace('.html', ''), '_blank');
    });

    // In Seite einfügen
    project_portfolio.appendChild(project_feed);
}

fetch('/static/data/activities.json')
.then(response => response.json())
.then(data => {
    data.forEach(activity => {
        add_activity_to_site(activity);
    })
})

async function add_activity_to_site(activity) {
    const activity_portfolio = document.getElementById("other_activities");

    const activity_feed = document.createElement("div");
    activity_feed.classList.add("activities");

    // Titel
    const activity_title = document.createElement("div");
    activity_title.classList.add("activity-title");
    activity_title.textContent = activity.titel;

    // Beschreibung
    const activity_text = document.createElement("div");
    activity_text.classList.add("activity-text");
    activity_text.textContent = activity.beschreibung;

    // Zusammenfügen
    activity_feed.appendChild(activity_title);
    activity_feed.appendChild(activity_text);

    // Klickereignis
    activity_feed.addEventListener('click', () => {
        console.log(activity.url);
        if (activity.url) {
            window.open('/project/' + activity.url.replace('.html', ''), '_blank');
        }
    });

    // Zur Seite hinzufügen
    activity_portfolio.appendChild(activity_feed);
}


//Menu
window.addEventListener('scroll', function () {
  const menu = document.querySelector('.menu');

  if (window.scrollY > 100) {
    menu.classList.add('hide');
  } else {
    menu.classList.remove('hide');
  }
});

function scroll_to_offset(div){
    const menuHeight = document.querySelector('.menu').offsetHeight - 15;
    console.log(menuHeight);
    const elementPosition = div.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - menuHeight;
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

const menu_aboutme = document.getElementById("menu_aboutme");
menu_aboutme.addEventListener("click", to_aboutme);
menu_aboutme.addEventListener("click", () => play_chords("A", "C", "E"));
function to_aboutme(){
    const aboutSection = document.getElementById("aboutme");
    
    scroll_to_offset(aboutSection);
}


const menu_projects = document.getElementById("menu_projects");
menu_projects.addEventListener("click", to_projects);
menu_projects.addEventListener("click", () => play_chords("F", "A", "C"));
function to_projects(){
    const projectSection = document.getElementById("project_section");
    scroll_to_offset(projectSection);
}

const menu_other_activities = document.getElementById("menu_otheractivities");
menu_other_activities.addEventListener("click", to_otheractivities);
menu_other_activities.addEventListener("click", () => play_chords("G", "B", "D"));
function to_otheractivities(){
    const other_activities_Section = document.getElementById("other_activities");
    scroll_to_offset(other_activities_Section);
}

const menu_contact = document.getElementById("menu_contact");
menu_contact.addEventListener("click", to_contact);
menu_contact.addEventListener("click", () => play_chords("C", "G", "E"));
function to_contact(){
    const contact_Section = document.getElementById("contact");
    scroll_to_offset(contact_Section);
}

//Enter Studio
// wenn Studio betreten wird, dann soll oben das menü nicht mehr auf andere seitenstellen verweisen

let in_studio = false;
let record = false;

const button_enter_studio = document.getElementById("button_to_studio");
button_enter_studio.addEventListener("click", ()=>{
    if (in_studio === false){
        console.log("Ich betrete das Studio!");
        let about_me_info_text = document.getElementById("about_me_info_text");
        about_me_info_text.classList.toggle('expanded');
        const piano = document.querySelector('.piano');
        if (!piano.classList.contains("expanded")) {
            piano.classList.add("expanded");
        }
        in_studio = true;
        //piano.classList.toggle('expanded');  
        document.getElementById("headline").classList.toggle("hidden");
        document.getElementById("text").classList.toggle("hidden");
        document.getElementById("noten_blatt").classList.toggle("hidden");
        //Entfernt funktionalitäten der menubuttons
        menu_aboutme.removeEventListener("click", to_aboutme);
        menu_contact.removeEventListener("click", to_contact);
        menu_other_activities.removeEventListener("click", to_otheractivities);
        menu_projects.removeEventListener("click", to_projects);

        // Ändere das Symbol, sodass wir nun im Studio sind
        button_enter_studio.textContent = "Im Studio!";
        console.log("Wähle deine Akkorde, in dem du auf die obigen Menupunkte drückst, um Akkorde zu wählen!");
        // Wenn auf obige Menupunkte gedrückt wird, dann soll ein Akkord aufgenommen werden
        
        const a_chord = document.getElementById("menu_aboutme");
        a_chord.addEventListener("click", 
            record_chordA
        );
        const f_chord = document.getElementById("menu_projects");
        f_chord.addEventListener("click",
            record_chordF
        );
        const g_chord = document.getElementById("menu_otheractivities");
        g_chord.addEventListener("click", 
            record_chordG
        );
        const c_chord = document.getElementById("menu_contact");
        c_chord.addEventListener("click", 
            record_chordC
        );
    }
    else{
        console.log("Ich verlasse das Studio!");
        about_me_info_text.classList.toggle('expanded');
        document.getElementById("headline").classList.toggle("hidden");
        document.getElementById("text").classList.toggle("hidden");
        document.getElementById("noten_blatt").classList.toggle("hidden");
        //fügt funktionalitäten der menubuttons
        menu_aboutme.addEventListener("click", to_aboutme);
        menu_contact.addEventListener("click", to_contact);
        menu_other_activities.addEventListener("click", to_otheractivities);
        menu_projects.addEventListener("click", to_projects);
        const a_chord = document.getElementById("menu_aboutme");
        // Beende das Recording!
        recording_beenden();
        // Entferne die Eventlistener 
        a_chord.removeEventListener("click", 
            record_chordA
        );
        const f_chord = document.getElementById("menu_projects");
        f_chord.removeEventListener("click", 
            record_chordF
        );
        const g_chord = document.getElementById("menu_otheractivities");
        g_chord.removeEventListener("click", 
            record_chordG
        );
        const c_chord = document.getElementById("menu_contact");
        c_chord.removeEventListener("click", 
            record_chordC
        );
        in_studio = false;
        button_enter_studio.textContent = "Betrete Studio!";
    }
    });



function handleKeyClick(event) {
    const note = event.currentTarget.dataset.note;
    naechsterTon(note);
}



// Recording

const record_button = document.getElementById("record_button");
record_button.addEventListener("click", () =>{
    // falls noch nicht im studio, record macht nichts:
    if (in_studio === false) {
        console.log("Betrete zunächst das Studio!");
    }
    else{
        if (record === false) {
            console.log("Nimmt Töne nun auf!");
            record = true;
            record_button.textContent = "REC";
            record_button.style.color = "red";
            // Nimm Akkorde auf!
            //choose_chords(chord_count);
        }
        //leave record mode
        else {
            recording_beenden();
        } 
    }
    }
    // Enter Record-Mode
);

async function recording_beenden(){
    console.log("Recording wird beendet!")
    chord_count = 0;
    record = false;
    record_button.textContent = "REC";
    record_button.style.color = "grey";
    // Speichere die Noten ab
    if (aufgenommeneNoten.length === 32){
        final_sheet = aufgenommeneNoten;
        final_chord_sheet = chord_sheet;
        final_chord_sheet = transform_chord_sheet(chord_sheet);
        console.log(final_chord_sheet);
        chord_sheet = [];
        aufgenommeneNoten = [];
        notes = 0;
    }
    else{
        console.log("Sheet nicht vollständig, bitte nehme neu auf!");
    }
}


function transform_chord_sheet(chord_sheet) {
    let new_chord_sheet = [];

    for (let chord of chord_sheet) {
        let new_chord = [];

        if (chord === "F") {
            new_chord = ["F", "A", "C"];
        }
        else if (chord === "A") {
            new_chord = ["A", "C", "E"];
        }
        else if (chord === "C") {
            new_chord = ["C", "E", "G"];
        }
        else if (chord === "G") {
            new_chord = ["G", "B", "D"]; // Achtung: "H" ist im internationalen System "B"
        }

        new_chord_sheet.push(new_chord);
    }

    return new_chord_sheet;
}

let final_sheet = [];
const play_button = document.getElementById("play_button");
play_button.addEventListener("click", () => play(final_sheet, final_chord_sheet));


function play(notes, chords, interval = 200) {
    let index = 0;
    play_button.textContent = "PLAY";
    play_button.style.color = "green";
    function playNext() {
        if (index < notes.length) {
            let note = notes[index];
            let audio = audioMap[note];
            let key_piano = document.querySelector(`.key[data-note="${note}"]`);
            if (key_piano) {
                key_piano.classList.add('active');
                setTimeout(() => {
                    key_piano.classList.remove('active');
                }, 200);
            }
            if (audio) {
                audio.currentTime = 0; // Zurückspulen bei erneutem Drücken
                audio.play();
            }
            if (index % 8 === 0 && chords.length > index / 8) {
                const akkord = chords[Math.floor(index / 8)];
                console.log(akkord);
                play_chords(akkord[0], akkord[1], akkord[2])
            }

        // Hier könntest du echten Sound abspielen
        index++;
        setTimeout(playNext, interval);
        } 
        else {
            console.log("Fertig mit abspielen!");
            play_button.style.color = "grey";
        }
    }

    playNext();
}


let chord_sheet = [];
let chord_count = 0;
let melody_activated = false;
function record_melody(){
    if (record === true){
        if (chord_count === 4){
            console.log("Melodie kann aufgenommen werden!");
            melody_activated = true;
            
            console.log("1Drücke auf die Klaviertasten oder Pause, um den " + (notes + 1) + ". Ton aufzunehmen!");

            // Alle Tasten finden
            const klaviertasten = document.querySelectorAll(".key");
            klaviertasten.forEach(taste => {
                taste.addEventListener("click", handleKeyClick);
            });
            console.log("Tasten haben neue funktionen nun!");
        }
    }
}

let notes = 0;
const maxNotes = 32;
let aufgenommeneNoten = [];
let final_chord_sheet = [];
function naechsterTon(note) {
    const taktBodies = document.querySelectorAll("div.takt_body");
    console.log(taktBodies);
    if (notes < maxNotes) {
        
        
        const quotient = Math.floor(notes / 8);  // Ganzzahliger Anteil (1)
        const rest = notes % 8;   
        console.log("quotient: " + quotient + ", rest: " + rest);
        let zaehlzeit = taktBodies[quotient].querySelectorAll("div.noten");
        zaehlzeit[rest].textContent = note;
        aufgenommeneNoten.push(note);
        notes++;
        console.log(`${notes}. Ton aufgenommen: ${note}`);

        if (notes < maxNotes) {
            console.log("Drücke eine Taste oder Pause, um den " + (notes + 1) + ". Ton aufzunehmen!");
        } else {
            console.log("Alle 32 Töne wurden aufgenommen!");
            console.log("Gespeicherte Noten:", aufgenommeneNoten);
        }
    }
    else{
        console.log("Sheet ist voll!! Drücke auf Record, um dein Sheet zu speichern!");
        console.log();
    }
}



function record_your_chords(chord){
    if (record === true){
        
        if (chord_count === 4){
            console.log("Alle Akkorde wurden aufgenommen!");
            console.log("Nun können Töne aufgenommen werden!");
            record_melody();
        }
        else{
            chord_count = chord_count + 1;
            chord_sheet.push(chord);
            console.log(chord_count);
            const unterDivs = document.querySelectorAll("#bass_notenzeile > div")[chord_count -1];
            console.log(unterDivs);
            const ersteNote = unterDivs.querySelector(".noten");
            ersteNote.textContent = chord;
        }
        
    }
    else {
        console.log("Nichts passiert!");
    }
}

function record_chordA(){
    console.log("A-Chord wurde aufgenommen!");
    record_your_chords("A");
}
function record_chordF(){
    console.log("F-Chord wurde aufgenommen!");
    record_your_chords("F");
}
function record_chordG(){
    console.log("G-Chord wurde aufgenommen!");
    record_your_chords("G");
}
function record_chordC(){
    console.log("C-Chord wurde aufgenommen!");
    record_your_chords("C");
}



// Play/Stop Button
// Choose Chord Progression
    // 1. Recording: Choose Chord progression by clicking on buttons above 4 times
    // 2. Choose Pattern
    // 3. Draw in the Sheet in the second row
// Record/Stop Recording Button
    // 1. Start Anlaufzeit von 4 Takten, starte Metronom, Start animation with line in achtel schritten, record the notes being played 
    // 2. Nach 4 Takten, passe die Noten an, indem Notenwerte angepasst werden
    // 3. Stop Recording 
    // 4. Speichern des Stückes (wie?)
        // Mithilfe von Local Storage und einer dictionary
        // Titel, Name, Tempo, Töne {ton, duration,}
// Adjust Tempo
// Delete Theme
// Save Theme
    // Als mp3. Speichern
//Aboutme