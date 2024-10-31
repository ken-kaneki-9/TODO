const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://sarvilrathour83:TBjgYhh4OZcEZsdp@users.acyrx.mongodb.net/users?retryWrites=true&w=majority&appName=users"
  )
  .then(() => {
    console.log(`Connected to MongoDB to ${mongoose.connection.host}`);
  })
  .catch(() => {
    console.log("failed");
  });

const newSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const collection = mongoose.model("collection", newSchema);

// app.get("/", (req, res) => {
//   res.send("Hello World!"); // Example response for root route
// });
app.get("/users", async (req, res) => {
  try {
    const users = await collection.find(); // Fetch all users
    res.json(users); // Send the list of users as a JSON response
  } catch (e) {
    res.status(500).json("fail"); // Send a 500 error if something goes wrong
  }
});
app.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const check = await collection.findOne({ username: username });

    if (check) {
      res.json("exist");
    } else {
      res.json("notexist");
    }
  } catch (e) {
    res.json("fail");
  }
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const data = {
    username: username,
    password: password,
  };

  try {
    const check = await collection.findOne({ username: username });

    if (check) {
      res.json("exist");
    } else {
      await collection.insertMany([data]);
      console.log("signup successful"); // Response after successful signup
      res.json("notexist");
    }
  } catch (e) {
    res.json("fail");
  }
});

app.listen(8000, () => {
  console.log("port connected");
});
