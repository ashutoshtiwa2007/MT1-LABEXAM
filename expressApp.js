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
    priority: "High",
  },
  {
    id: 2,
    taskName: "Create Dashboard",
    assignedTo: "Amit Kumar",
    status: "Completed",
    priority: "Medium",
  },
  {
    id: 3,
    taskName: "Test REST API",
    assignedTo: "Priya Singh",
    status: "In Progress",
    priority: "Low",
  },
];

let nextID = 4;

const getAllTasks = () => tasks;

const getTaskById = (id) => tasks.find((task) => task.id === id);

const addTask = (newTask) => {
  const task = {
    id: nextID++,
    ...newTask,
  };

  tasks.push(task);

  return task;
};

const updateTaskById = (id, updateTask) => {
  const task = getTaskById(id);

  if (!task) return null;

  Object.assign(task, updateTask);

  return task;
};

const deleteTask = (id) => {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) return false;

  tasks.splice(index, 1);

  return true;
};

app.get("/tasks", (req, res) => {
  const tasks = getAllTasks();

  res.status(200).json({
    count: tasks.length,
    data: tasks,
  });
});

app.get("/tasks/:id", (req, res) => {
  const { id } = req.params;

  const task = getTaskById(Number(id));

  if (!task)
    return res.status(404).json({
      error: `Task with id: ${id} not found`,
    });

  res.status(200).json({
    Message: "Task Found",
    data: task,
  });
});

app.post("/tasks", (req, res) => {
  const { taskName, assignedTo, status, priority } = req.body;

  if (!taskName || !assignedTo || !status || !priority)
    return res.status(400).json({
      error: "Task Name, Assigned To, Status or Priority not defined",
    });

  const task = addTask({
    taskName,
    assignedTo,
    status,
    priority,
  });

  res.status(201).json({
    Message: "Task registered successfully",
    data: task,
  });
});

app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;

  const oldTask = getTaskById(Number(id));

  if (!oldTask)
    return res.status(404).json({
      error: `Task with id: ${id} not found`,
    });

  const { taskName, assignedTo, status, priority } = req.body;

  if (!taskName || !assignedTo || !status || !priority)
    return res.status(400).json({
      error: "Task Name, Assigned To, Status or Priority not defined",
    });

  const updateTask = updateTaskById(Number(id), {
    taskName,
    assignedTo,
    status,
    priority,
  });

  res.status(200).json({
    Message: "Task updated successfully",
    data: updateTask,
  });
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  const task = getTaskById(Number(id));

  if (!task)
    return res.status(404).json({
      error: `Task with id: ${id} not found`,
    });

  deleteTask(Number(id));

  res.status(200).json({
    Message: "Task deleted successfully",
    data: task,
  });
});

app.use((req, res) => {
  res.status(404).send("Not found");
});

const server = app.listen(PORT, () => {
  console.log("Express Server is running at", PORT);
});

server.on("error", (err) => {
  console.log("Server error:", err);
});
