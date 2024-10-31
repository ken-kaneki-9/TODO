import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react"; // Import the icons from Lucide
import "./SolarSystem.css";

function SolarSystem() {
  const [placeholderss, SetPlaceholders] = useState([]);
  const [inputValue, setInputValue] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch todos from the backend
  const fetchTodos = async () => {
    try {
      const response = await axios.get("https://todo-5h8u.onrender.com/get"); // Fetch all todos
      SetPlaceholders(response.data); // Store all todos
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://todo-1-grc1.onrender.com/users"
      ); // Adjusted endpoint to point to server2
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // useEffect to fetch todos and users on component mount
  useEffect(() => {
    fetchTodos();
    fetchUsers();
  }, []);

  // Handle input change
  const sarvildon = (e) => {
    setInputValue(e.target.value);
  };

  // Add new todo
  const newtodo = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem("username");
    console.log("Username from local storage:", username);

    if (inputValue.trim()) {
      const newTodo = {
        task: inputValue,
        done: false, // Set the initial done state to false
        username: username,
      };

      try {
        await axios.post("https://todo-5h8u.onrender.com/add", newTodo);
        setInputValue(""); // Clear the input field
        fetchTodos(); // Refetch todos to get the updated list
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  // Delete todo
  const deletee = async (id) => {
    try {
      await axios.delete(`https://todo-5h8u.onrender.com/todos/${id}`);
      SetPlaceholders(placeholderss.filter((sarvil) => sarvil._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Toggle todo completion status
  const statechange = async (id) => {
    const todoToUpdate = placeholderss.find((sarvil) => sarvil._id === id);
    const updatedTodo = { ...todoToUpdate, done: !todoToUpdate.done }; // Toggle the done status

    try {
      await axios.put(
        `https://todo-5h8u.onrender.com/update/${id}`,
        updatedTodo
      );
      fetchTodos(); // Refetch todos to get the updated list
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className="todo">
      <h1>Goals to do before 2024</h1>
      <div className="wrapper">
        <form onSubmit={newtodo}>
          <input type="text" value={inputValue} onChange={sarvildon} />
          <button type="submit">Add</button>
        </form>
        <ul>
          {placeholderss.map((sarvil) => (
            <li key={sarvil._id}>
              {sarvil.task} {"   "}
              {sarvil.done ? (
                <CheckCircle color="green" size={20} title="Completed" /> // Using CheckCircle icon
              ) : (
                <XCircle color="red" size={20} title="Pending" /> // Using XCircle icon
              )}{" "}
              {"  "}
              <span>----{sarvil.username}</span> {/* Display creator's name */}
              {sarvil.username === localStorage.getItem("username") && ( // Check if the current user matches the username of the todo
                <>
                  <button onClick={() => deletee(sarvil._id)}>Delete</button>{" "}
                  <button onClick={() => statechange(sarvil._id)}>
                    {sarvil.done ? "Mark as Pending" : "Mark as Complete"}
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SolarSystem;
