const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./db/db.json");
const uuid = require("./helpers/uuid");

const PORT = 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Gets Home page when loading
app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "./public/index.html")));

// Gets Notes Page when pressing "get Started" btn
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// GET request for notes when /notes opens up
app.get("/api/notes", (req, res) => {
   // Displays the data with JSON
    res.json(db);
    console.info(`${req.method} request received to get notes`)
})

// POST request for notes when a new note is made in /notes
app.post("/api/notes", (req, res) => {
    // Displays the POST data in console
    // console.log(req.body)
    // console.log("TITLE: ", req.body.title)
    // console.log("TEXT: ", req.body.text)

    // TO DO: 
    // - From the req.body, post it in the db
    // - Add an ID to it as well
    const { title, text} = req.body;

    if( title && text ){
        const newNote = {
            id: uuid(),
            title,
            text,
        }

        fs.readFile("./db/db.json", (err, data) => {
            if(err) {
                console.error(err);
            } else{
                const parsedNotes = JSON.parse(data)
   
                parsedNotes.push(newNote);

                // Add a new Note
                fs.writeFile(
                    "./db/db.json",
                    JSON.stringify( parsedNotes, null, 4),
                    (writeErr) =>
                    writeErr ? console.error(writeErr)
                    : console.info('Successfully updated reviews!')      
                )
            }
        });

        const response = {
            status: "success", 
            body: newNote,
        }

        console.log(response);
        res.json(response);
    } else {
        res.json("Error in posting note")
    }


    // let notesdb = req.json() 
    // console.info(`Receiving... ${notesdb}`) 
});

// DELETE request for a certain ID
app.delete("/api/notes/:id", (req, res) => {
    // Gets the ID from req
    console.log("BODY: ", req.body)
})



app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT} 🚀`))

