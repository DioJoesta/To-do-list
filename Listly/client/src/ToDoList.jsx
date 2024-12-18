import React, { useState, useEffect } from "react";
import axios from "axios";

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newtask, setNewTask] = useState("");

    // Load tasks from the server when the component mounts
    useEffect(() => {
        axios.get("http://localhost:5000/task")
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error("Error fetching tasks:", error);
            });
    }, []); // Empty array means this runs only once when the component mounts

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        if (newtask.trim() !== '') {
            axios.post("http://localhost:5000/task", { text: newtask })
                .then(response => {
                    setTasks(prevTasks => [...prevTasks, response.data]);
                    setNewTask('');
                })
                .catch(error => {
                    console.error("Error adding task:", error);
                });
        }
    }

    function deleteTask(id) {
        axios.delete(`http://localhost:5000/task/${id}`)
            .then(() => {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
            })
            .catch(error => {
                console.error("Error deleting task:", error);
            });
    }

    function moveTaskUp(index) {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(index) {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    return (
        <>
            <div className="to-do-list">
                <h1>To-do List</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Enter task here..."
                        value={newtask}
                        onChange={handleInputChange}
                    />
                    <button className="add-button" onClick={addTask}>Add</button>
                </div>
            </div>
            <div>
                <ol>
                    {tasks.map((task, index) => (
                        <li key={task.id}>
                            <span className="text">{task.text}</span>
                            <button className="delete-button" onClick={() => deleteTask(task.id)}>delete</button>
                            <button className="move-button" onClick={() => moveTaskUp(index)}>up</button>
                            <button className="move-button" onClick={() => moveTaskDown(index)}>down</button>
                        </li>
                    ))}
                </ol>
            </div>
        </>
    );
}

export default ToDoList;
