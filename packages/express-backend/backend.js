import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userService from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET /users, /users?name=, /users?job=, /users?name=&job=
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  userService
    .getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching users.");
    });
});

// GET /users/:id
app.get("/users/:id", (req, res) => {
  const id = req.params["id"];

  userService
    .findUserById(id)
    .then((result) => {
      if (result === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((error) => {
      // An id that isn't a valid MongoDB ObjectId throws a CastError
      console.log(error);
      res.status(404).send("Resource not found.");
    });
});

// POST /users
app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userService
    .addUser(userToAdd)
    .then((savedUser) => {
      res.status(201).send(savedUser);
    })
    .catch((error) => {
      // Fails schema validation, e.g. a missing name or a job under 2 characters
      console.log(error);
      res.status(400).send(error.message);
    });
});

// DELETE /users/:id
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];

  userService
    .removeUser(id)
    .then((deletedUser) => {
      if (deletedUser === null) {
        res.status(404).send();
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send();
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});