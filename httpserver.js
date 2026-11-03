import http from 'http';

const tasks = [
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
        taskName: "Testing API",
        assignedTo: "Priya Singh",
        status: "In Progress"
    }
];

const server = http.createServer((req, res) => {

    const url = req.url;

    // Route 1: Home
    if (url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Welcome to Employee Task Management</h1>");
    }

    // Route 2: Display all tasks
    else if (url === "/tasks") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(tasks));
    }

    // Route 3: About
    else if (url === "/about") {

        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        res.end("Employee Task Management Application");
    }

    // Invalid route
    else {

        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 - Page Not Found");
    }

});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});