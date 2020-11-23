// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//All Notes
let notes = [];

//If Json file is empty dont commit to resting information
//Gets from 'db.json' and adds to the working Notes array
fs.readFile("db.json", "utf8", function (err, data) {
  if (data === "") {
  } else {
    let savedNotes = JSON.parse(data);
    notes = savedNotes;
  }
});

// Routes
// =============================================================

//Initalize static and script tags

app.use(express.static("../public"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/notes.html"));
});

//This will get from resting api and add to the notes array
app.get("/api/notes", function (req, res) {
  // notes.push(savedNotes);
  return res.json(notes);
});

//Delete Request
app.delete("/api/notes/:id", function (req, res) {
  let chosen = parseInt(req.params.id);

  const updated = notes.filter((el) => el.id !== chosen);

  // console.log("Original:");
  // console.log(notes);
  // console.log("Deleted:");

  packageAndStore(updated);
  notes = updated;
});

//create a function that takes an array numbers it and sends it to the db.json
function packageAndStore(array) {
  for (let i = 0; i < array.length; i++) {
    array[i].id = i + 1;
  }

  fs.writeFileSync("db.json", JSON.stringify(array), function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
}

//Post
//Post from the index.js to the resting api
app.post("/api/notes", function (req, res) {
  let newNote = req.body;
  notes.push(newNote);
  packageAndStore(notes);
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
