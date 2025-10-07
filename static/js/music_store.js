fetch('/static/data/sheet.json')
.then(response => response.json())
.then(data => {
    data.forEach(sheet => {
        console.log(sheet.titel, sheet.description);
        add_sheet_to_site(sheet);
    })
})

async function add_sheet_to_site(sheet) {
    //platziere die neuen sheets in music_sheet_section
    const music_section = document.getElementById("music_sheet_section");

    //erstelle ein neues div
    const sheet_div = document.createElement("div");
    sheet_div.classList.add("sheet");

    //Lese Titel, Interpret, Datum und Beschreibung ein
    const sheet_title = document.createElement("div");
    sheet_title.classList.add("sheet_title");
    sheet_title.textContent = sheet.titel;

    //Bild
    const sheet_image = document.createElement("div");
    sheet_image.classList.add("sheet_image");
    const img = document.createElement("img");
    console.log("test" + sheet.image);
    img.src = "/static/music_store/images/" + sheet.image;
    console.log("/static/music_store/images/" + sheet.audio);
    sheet_image.addEventListener("click", () =>{
        // a Element für Hyperlinks
        const link = document.createElement("a");
        link.href = "/static/music_store/data/" + sheet.pdf;
        link.download = sheet.pdf;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    })
    sheet_image.appendChild(img);

    //Leiste für Midi Vorschau
    const music_store_midi_all = document.createElement("div");
    //Download Midi
    const midi_download = document.createElement("div");
    midi_download.classList.add("sheet_download")
    midi_download.textContent = "Download Midi!";
    midi_download.addEventListener("click", () =>{
        const link = document.createElement("a");
        link.href = "/static/music_store/data/" + sheet.audio;
        link.download = sheet.audio;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    })
    music_store_midi_all.appendChild(midi_download);
    // MIDI-Vorschau-Leiste
    const sheet_mid = document.createElement("div");
    sheet_mid.classList.add("sheet_mid");
    sheet_mid.textContent = "▶️ MIDI-Vorschau abspielen";

    let isPlaying = false;
    let synth;
    let midi;

    // Funktion zum Laden der MIDI-Datei
    async function loadMidi() {
    const response = await fetch("/static/music_store/data/" + sheet.audio);
    const arrayBuffer = await response.arrayBuffer();
    midi = new Midi(arrayBuffer);
    }

    // Eventlistener
    sheet_mid.addEventListener("click", async () => {
    if (!isPlaying) {
        // 🔹 Falls noch keine MIDI-Datei geladen wurde
        if (!midi) await loadMidi();

        // 🔹 Neues Synthesizer-Objekt erstellen
        synth = new Tone.PolySynth(Tone.Synth).toDestination();

        // 🔹 Alle Noten planen
        midi.tracks.forEach(track => {
        track.notes.forEach(note => {
            synth.triggerAttackRelease(
            note.name,
            note.duration,
            note.time + Tone.now(),
            note.velocity
            );
        });
        });

        // 🔹 Starten
        Tone.Transport.start();
        sheet_mid.textContent = "⏹️ Stop";
        isPlaying = true;

    } else {
        // 🔹 Stoppen & Bereinigen
        Tone.Transport.stop();
        Tone.Transport.cancel(); // entfernt geplante Events
        synth.dispose();         // entfernt alte Synth-Instanz
        sheet_mid.textContent = "▶️ MIDI-Vorschau abspielen";
        isPlaying = false;
    }
    });
    music_store_midi_all.appendChild(sheet_mid);
    // Füge alles in das DIV ein
    sheet_image.appendChild(img);
    

    const sheet_author= document.createElement("div");
    sheet_author.classList.add("sheet_author");
    sheet_author.textContent = sheet.author;

    const sheet_date = document.createElement("div");
    sheet_date.classList.add("sheet_date");
    sheet_date.textContent = sheet.date;

    //Füge Titel, interpret und datum in das sheet_div ein
    sheet_div.appendChild(sheet_image);
    sheet_div.appendChild(music_store_midi_all);
    sheet_div.appendChild(sheet_title);
    sheet_div.appendChild(sheet_author);
    sheet_div.appendChild(sheet_date);

    //Füge das neue div in die music_sheet_section ein
    music_section.appendChild(sheet_div);
}