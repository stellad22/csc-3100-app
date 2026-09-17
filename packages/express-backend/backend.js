import express from "express";
import cors from "cors";


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
    {
      "id": "qwe123",
      "job": "Zookeeper",
      "name": "Cindy",   
    },
  ],
};


const findUserById = (id) =>
    users["users_list"].filter((user) => user["id"] === id);

const findUserByName = (name) =>
    users["users_list"].filter((user) => user["name"] === name);

const findUserByNameAndJob = (name, job) =>
    users["users_list"].filter((user) => user["name"] === name && user["job"] === job);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;  //or req.params.id
    if (name !== undefined && job !== undefined) {
        let result = findUserByNameAndJob(name, job);
        res.send(result);
    }
    else if(name !== undefined) {
        let result = findUserByName(name);
        res.send(result);
    }
    else {
        res.send(users);
    }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result.length === 0) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send();
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  users["users_list"] = users["users_list"].filter((user) => user["id"] !== id);
  res.send();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
