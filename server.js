const express = require("express");
const path = require("path");
const fs = require("fs");
var db = require("./db/db.json");
const uuid = require("./helpers/uuid");

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gets Home page when loading
app.use(express.static("public"));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

// Gets Notes Page when pressing "get Started" btn
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// GET request for notes when /notes opens up
app.get("/api/notes", (req, res) => {
  // Displays the data with JSON
  res.json(db);
  console.info(`${req.method} request received to get notes`);
});

// POST request for notes when a new note is made in /notes
app.post("/api/notes", (req, res) => {
  req.body.id = uuid();
  const newNote = req.body;
  db.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(db));
  res.json(db);
});

// DELETE request for a certain ID
app.delete("/api/notes/:id", (req, res) => {
  // Gets the ID from req
  const id = req.params.id;
  // notedb will hold the original db

  console.log("ID from req.params: ", id);

  db = db.filter((notes) => notes.id != id);

  console.log(db);

  fs.writeFileSync("./db/db.json", JSON.stringify(db));
  res.json(db);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
