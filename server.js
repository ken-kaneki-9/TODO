const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Define the Todo schema and model
const TodoSchema = new mongoose.Schema({
  task: String,
  username: {
    type: String,
  },
  done: {
    type: Boolean,
    default: false,
  },
});

const TodoModel = mongoose.model("todos", TodoSchema);
async function setupUserModel() {
  const usersConnection = await connectUsersDB();

  const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
  });

  // Use the usersConnection to define a model for the `users` database
  const UserModel = usersConnection.model("users", UserSchema);
  return UserModel;
}
// Connect to MongoDB
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/todo");
  console.log("Connected to MongoDB");
}
async function connectUsersDB() {
  const usersConnection = mongoose.createConnection(
    "mongodb://127.0.0.1:27017/users",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log("Connected to Users Database");
  return usersConnection;
}
// Call the main function and handle errors
main().catch((err) => console.log(err));

// Define routes

// Add a new todo
app.post("/add", (req, res) => {
  const { task } = req.body;
  const username = req.body.username;
  TodoModel.create({
    task: task,
    username: username,
  })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

// Update a todo's completion status
app.put("/update/:id", (req, res) => {
  const { id } = req.params; // Corrected to use req.params
  const updatedData = req.body; // Get the updated todo data from the request body

  TodoModel.findByIdAndUpdate(id, updatedData, { new: true }) // Use { new: true } to return the updated document
    .then((updatedTodo) => {
      res.json(updatedTodo);
    })
    .catch((err) => res.status(400).json(err));
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params; // Get the id from request parameters

  TodoModel.findByIdAndDelete(id)
    .then(() => res.json({ message: "Todo deleted successfully" }))
    .catch((err) => res.status(400).json(err));
});
app.get("/users", async (req, res) => {
  try {
    const UserModel = await setupUserModel(); // Get the UserModel connected to the `users` database
    const users = await UserModel.find(); // Fetch all users from the `users` database
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
});
// Get all todos
app.get("/get", (req, res) => {
  TodoModel.find()
    .then((todos) => res.json(todos))
    .catch((err) => res.status(400).json(err));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
