const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to...", url);

mongoose
  .connect(url)
  .then((result) => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB:", err.message));

const phoneBookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "should be atleast 3 characters long"],
    required: [true, "can't be blank"],
  },
  number: {
    type: String,
    minLength: [8, "should have atleast 8 digits"],
    validate: {
      validator: (value) => /(\d{2,})-(\d{6,})|(\d{3,})-(\d{5,})/.test(value),
      message: (props) => `${props.value} is not a valid number format`,
    },
    required: [true, "can't be blank"],
  },
});

phoneBookSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("person", phoneBookSchema);
