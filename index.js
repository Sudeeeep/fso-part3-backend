const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

morgan.token("reqBody", (request, response) => JSON.stringify(request.body));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqBody"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  response.send(`<h3>Phonebook has info for ${persons.length} people </h3>
                  <h3>${currentDate}</h3>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const requestedPerson = persons.find((person) => person.id === id);

  if (requestedPerson) {
    response.json(requestedPerson);
  } else {
    response.sendStatus(404);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const deletedPerson = persons.find((person) => person.id == id);

  persons = persons.filter((person) => person.id !== id);
  response.send(`${deletedPerson.name} deleted from server`);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const id = Math.floor(Math.random() * 99999999);

  if (!body.name || !body.number) {
    return response.status(404).json({ error: "name or number missing" });
  } else if (persons.find((person) => person.name === body.name)) {
    return response.status(404).json({ error: "name must be unique" });
  }

  const newPerson = {
    id: id,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  response.send(persons);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
