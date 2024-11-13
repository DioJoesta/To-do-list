import React, { useState, useEffect } from "react";

function ToDoList() {
    // Load tasks from local storage on initial render
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("listly");
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [newtask, setNewTask] = useState("");

    // Save tasks to local storage whenever 'tasks' changes
    useEffect(() => {
        localStorage.setItem("listly", JSON.stringify(tasks));
    }, [tasks]);

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        if (newtask.trim() !== '') {
            setTasks(t => [...t, newtask]);
            setNewTask('');
        }
    }

    function deleteTask(index) {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
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
                        <li key={index}>
                            <span className="text">{task}</span>
                            <button className="delete-button" onClick={() => deleteTask(index)}>delete</button>
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
