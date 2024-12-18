import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
const port = 5000;

// Middleware to allow cross-origin requests from your frontend
app.use(cors());
app.use(express.json());

// Set up the MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password", // Adjust if needed
    database: "todoapp",
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to the database");
});

// Get all tasks
app.get("/task", (req, res) => {
    const query = "SELECT * FROM task";
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching task:", err);
            return res.status(500).json({ error: "Error fetching task" });
        }
        res.json(result); // Respond with the tasks
    });
});

// Add a new task
app.post("/task", (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Task text is required" });
    }

    const query = "INSERT INTO task (text) VALUES (?)";
    db.query(query, [text], (err, result) => {
        if (err) {
            console.error("Error adding task:", err);
            return res.status(500).json({ error: "Error adding task" });
        }
        // Send back the added task with its generated ID
        res.json({ id: result.insertId, text });
    });
});

// Delete a task
app.delete("/task/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM task WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting task:", err);
            return res.status(500).json({ error: "Error deleting task" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
