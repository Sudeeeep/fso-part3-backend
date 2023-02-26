require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/persons");
const { response } = require("express");

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

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Person does not exist" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  return response.status(400).send({ error: "ERROR" });

  next(error);
};

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((persons) => response.json(persons));
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  Contact.countDocuments({}, (err, count) => {
    response.send(`<h3>Phonebook has info for ${count} people </h3>
    <h3>${currentDate}</h3>`);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((person) => response.json(person))
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then((person) => response.status(204).end())
    .catch((err) => next(err));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const newPerson = new Contact({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((err) => {
      next(err);
      console.log(err.name);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((err) => next(err));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
