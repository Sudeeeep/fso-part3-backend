const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please enter more arguments");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://sudeeeep:${password}@cluster0.rwrdu9v.mongodb.net/Phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Contact = mongoose.model("person", phoneBookSchema);

const person = new Contact({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length < 4) {
  console.log("phonebook");

  Contact.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  person.save().then((result) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
