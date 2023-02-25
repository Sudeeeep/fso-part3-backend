require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/persons");

const app = express();
const PORT = process.env.PORT;

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

morgan.token("reqBody", (request, response) => JSON.stringify(request.body));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqBody"
  )
);

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((persons) => response.json(persons));
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  response.send(`<h3>Phonebook has info for ${persons.length} people </h3>
                  <h3>${currentDate}</h3>`);
});

app.get("/api/persons/:id", (request, response) => {
  Contact.findById(request.params.id)
    .then((person) => response.json(person))
    .catch((err) => response.status(404).send({ error: "PERSON NOT FOUND" }));
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const deletedPerson = persons.find((person) => person.id == id);

  persons = persons.filter((person) => person.id !== id);
  response.send(`${deletedPerson.name} deleted from server`);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(404).json({ error: "name or number missing" });
  }
  // } else if (Contact.exists({ name: body.name })) {
  //   return response.status(404).json({ error: "name must be unique" });
  // }

  const newPerson = new Contact({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((savedPerson) => response.json(savedPerson));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
