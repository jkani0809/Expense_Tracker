// server.js
const jsonServer = require("json-server");
const cors = require("cors");

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Routers for each JSON file
const usersRouter = jsonServer.router("db.json");
const detailsRouter = jsonServer.router("details.json");

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

// Middleware: Add createdAt to /users POST requests
server.use("/users", (req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = new Date().toISOString();
  }
  next();
});

// Mount routers
server.use("/users", usersRouter);
server.use("/details", detailsRouter);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`JSON Server running on http://localhost:${PORT}`);
  console.log(`Users endpoint:    http://localhost:${PORT}/users`);
  console.log(`Details endpoint:  http://localhost:${PORT}/details`);
});
