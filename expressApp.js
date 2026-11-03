import express from "express";

const app = express();

const PORT = 4000;

app.use(express.json());

// Employee task array
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },
    {
        id: 2,
        taskName: "Create Dashboard",
        assignedTo: "Amit Kumar",
        status: "Completed",
        priority: "Medium"
    },
    {
        id: 3,
        taskName: "Test REST API",
        assignedTo: "Priya Singh",
        status: "In Progress",
        priority: "Low"
    }
];

let nextID = 4;

// GET all tasks
const getAllTasks = () => tasks;

// GET task by ID
const getTaskById = (id) =>
    tasks.find((task) => task.id === id);

// ADD new task
const addTask = (newTask) => {

    const task = {
        id: nextID++,
        ...newTask
    };

    tasks.push(task);

    return task;
};

// UPDATE task
const updateTaskById = (id, updateTask) => {

    const task = getTaskById(id);

    if (!task) return null;

    Object.assign(task, updateTask);

    return task;
};

// DELETE task
const deleteTask = (id) => {

    const index = tasks.findIndex(
        (task) => task.id === id
    );

    if (index === -1) return false;

    tasks.splice(index, 1);

    return true;
};


// ---------------- CRUD ROUTES ----------------


// GET /tasks
app.get("/tasks", (req, res) => {

    const tasks = getAllTasks();

    res.status(200).json({
        count: tasks.length,
        data: tasks
    });

});


// GET /tasks/:id
app.get("/tasks/:id", (req, res) => {

    const { id } = req.params;

    const task = getTaskById(Number(id));

    if (!task)
        return res.status(404).json({
            error: `Task with id: ${id} not found`
        });

    res.status(200).json({
        Message: "Task Found",
        data: task
    });

});


// POST /tasks
app.post("/tasks", (req, res) => {

    const {
        taskName,
        assignedTo,
        status,
        priority
    } = req.body;

    if (!taskName || !assignedTo || !status || !priority)
        return res.status(400).json({
            error: "Task Name, Assigned To, Status or Priority not defined"
        });

    const task = addTask({
        taskName,
        assignedTo,
        status,
        priority
    });

    res.status(201).json({
        Message: "Task registered successfully",
        data: task
    });

});


// PUT /tasks/:id
app.put("/tasks/:id", (req, res) => {

    const { id } = req.params;

    const oldTask = getTaskById(Number(id));

    if (!oldTask)
        return res.status(404).json({
            error: `Task with id: ${id} not found`
        });

    const {
        taskName,
        assignedTo,
        status,
        priority
    } = req.body;

    if (!taskName || !assignedTo || !status || !priority)
        return res.status(400).json({
            error: "Task Name, Assigned To, Status or Priority not defined"
        });

    const updateTask = updateTaskById(Number(id), {
        taskName,
        assignedTo,
        status,
        priority
    });

    res.status(200).json({
        Message: "Task updated successfully",
        data: updateTask
    });

});


// DELETE /tasks/:id
app.delete("/tasks/:id", (req, res) => {

    const { id } = req.params;

    const task = getTaskById(Number(id));

    if (!task)
        return res.status(404).json({
            error: `Task with id: ${id} not found`
        });

    deleteTask(Number(id));

    res.status(200).json({
        Message: "Task deleted successfully",
        data: task
    });

});


// Invalid route
app.use((req, res) => {

    res.status(404).send("Not found");

});


// Start server
const server = app.listen(PORT, () => {

    console.log("Express Server is running at", PORT);

});

server.on("error", (err) => {

    console.log("Server error:", err);

});