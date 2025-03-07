import { Router } from "express";
import { Database } from "bun:sqlite";

const router = Router();
const db = new Database("database.sqlite");

// Serve users
router.get("/data", (req, res) => {
  const users = db.query("SELECT * FROM users").all();
  console.log(users);
  let usersHtml = '<form id="selectCharacterForm" hx-get="/characterTab" hx-target="#characterCreation" hx-swap="outerHTML">';
  usersHtml += '<select name="selectedUser" id="selectedUser">';
  users.forEach(user => {
    usersHtml += `<option value="${user.id}">${user.name}</option>`;
  });
  usersHtml += '</select>';
  usersHtml += '<button>Select Character</button></form>';
  res.send(usersHtml);
});

router.post("/createNewUser", (req, res) => {
  console.log(req.body);
  const {name} = req.body;
  
  if (!name) {
    return res.send('<p>Error: Name is required</p>');
  }

  try {
    db.run("INSERT INTO users (name) VALUES (?)", [name]);
    console.log(`User ${name} created`);
    res.send(`User ${name} created`);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
});

// Handle character selection
router.get("/characterTab", (req, res) => {
  console.log(req.query);
  const { selectedUser } = req.query;
  console.log(selectedUser);
  const user = db.query("SELECT * FROM users WHERE id = ?").get([Number(selectedUser)]);
  console.log(user);
  if (user) {
    let userHtml = `<h2>${user.name}</h2>`;
    userHtml += '<button hx-get="/data" hx-target="#characterCreation" hx-swap="outerHTML">Back</button>';
    res.send(userHtml);
  } else {
    res.send('<p>Error: User not found</p>');
  }
});


export default router;
