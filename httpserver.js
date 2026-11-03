import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Employee tasks
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Create Dashboard",
        assignedTo: "Amit Kumar",
        status: "Completed"
    },
    {
        id: 3,
        taskName: "Test REST API",
        assignedTo: "Priya Singh",
        status: "In Progress"
    }
];

// Helper function to send JSON responses
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));
}

// Create HTTP server
const server = http.createServer((req, res) => {

    // GET /
    if (req.method === "GET" && req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        return res.end(`
            <h1>Welcome to Employee Task Management</h1>
            <p>Node.js HTTP Server is running.</p>
        `);
    }

    // GET /tasks
    else if (req.method === "GET" && req.url === "/tasks") {

        return sendJSON(res, 200, tasks);
    }

    // GET /about
    else if (req.method === "GET" && req.url === "/about") {

        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        return res.end(
            "Employee Task Management Application"
        );
    }

    // GET /home - Serve HTML using FS module
    else if (req.method === "GET" && req.url === "/home") {

        const filePath = path.join(
            __dirname,
            "public",
            "index.html"
        );

        fs.readFile(filePath, "utf8", (err, data) => {

            if (err) {
                return sendJSON(res, 500, {
                    message: "Error reading HTML file"
                });
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });

    }

    // POST /add-task
    else if (
        req.method === "POST" &&
        req.url === "/add-task"
    ) {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {

            try {

                const newTask = JSON.parse(body);

                const {
                    id,
                    taskName,
                    assignedTo,
                    status
                } = newTask;

                // Validate required fields
                if (
                    !Number.isInteger(id) ||
                    id <= 0 ||
                    typeof taskName !== "string" ||
                    !taskName.trim() ||
                    typeof assignedTo !== "string" ||
                    !assignedTo.trim() ||
                    typeof status !== "string" ||
                    !status.trim()
                ) {

                    return sendJSON(res, 400, {
                        message: "Please provide valid task details"
                    });
                }

                // Check duplicate ID
                const existingTask = tasks.find(
                    task => task.id === id
                );

                if (existingTask) {
                    return sendJSON(res, 400, {
                        message: "Task ID already exists"
                    });
                }

                // Add task
                tasks.push(newTask);

                return sendJSON(res, 201, {
                    message: "Task added successfully",
                    task: newTask
                });

            } catch (error) {

                return sendJSON(res, 400, {
                    message: "Invalid JSON data"
                });
            }

        });

    }

    // Invalid route
    else {

        return sendJSON(res, 404, {
            message: "404 - Page Not Found"
        });
    }

});

// Start server
server.listen(3000, () => {
    console.log(
        "HTTP Server running at http://localhost:3000"
    );
});