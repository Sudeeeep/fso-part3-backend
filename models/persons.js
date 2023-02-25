const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to...", url);

mongoose
  .connect(url)
  .then((result) => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB:", err.message));

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

phoneBookSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("person", phoneBookSchema);
