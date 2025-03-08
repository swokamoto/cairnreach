import { Router } from "express";
import { Database } from "bun:sqlite";

const router = Router();
const db = new Database("database.sqlite");


// Serve the login form
router.get("/loginForm", (req, res) => {
  let loginForm = `
    <section id="characterCreation">
      <form id="loginForm" hx-post="/createNewUser" hx-target="#mainContent" hx-swap="innerHTML">
        <label for="name">New Character Name:</label>
        <input type="text" id="name" name="name" required>
        <br>
        <label for="class">Select a Class:</label>
        <select id="class" name="class_id" required>
          <option value="1">Hunter</option>
          <option value="2">Forager</option>
          <option value="3">Artisan</option>
          <option value="4">Steward</option>
          <option value="5">Wayfinder</option>
          <option value="6">Warden</option>
        </select>
        <br>
        <button>Create New</button>
      </form>
      <br>
      <form id="selectUserForm" hx-post="/checkCharacter" hx-target="#mainContent" hx-swap="innerHTML">
        <label for="characterName">Login with Character Name:</label>
        <input type="text" id="characterName" name="characterName" required>
        <button type="submit">Let's Go!</button>
      </form>
    </section>
  `;
  res.send(loginForm);
});


// Check for existing character
router.post("/checkCharacter", (req, res) => {
  const { characterName } = req.body;
  const user = db.query(`
    SELECT users.id, users.name, Class.name AS class
    FROM users
    LEFT JOIN Class ON users.class_id = Class.id
    WHERE users.name = ?
  `).get([characterName]);

  if (user) {
    let userDashboardHtml = userDashboard(user);
    res.send(userDashboardHtml);
  } else {
    res.send('<p>Error: Character not found</p><button hx-get="/loginForm" hx-target="#mainContent" hx-swap="innerHTML">Back</button>')
  }
});

// Create a new user
router.post("/createNewUser", (req, res) => {
  console.log(req.body);
  const { name, class_id } = req.body;

  if (!name || !class_id) {
    return res.send('<p>Error: Name and class are required</p>');
  }

  try {
    db.run("INSERT INTO users (name, class_id) VALUES (?, ?)", [name, class_id]);
    console.log(`User ${name} with class ID ${class_id} created`);

    // Fetch the newly created user's details along with class information
    const user = db.query(`
      SELECT users.id, users.name, Class.name AS class
      FROM users
      LEFT JOIN Class ON users.class_id = Class.id
      WHERE users.name = ? AND users.class_id = ?
    `).get([name, class_id]);

    let userDashboardHtml = userDashboard(user);
    res.send(userDashboardHtml);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
});

function userDashboard(user) {
  return `
    <section id="userDashboard">
      <h2>Welcome, ${user.name}!</h2>
      <p>Class: ${user.class}</p>
      <br>
      <button hx-get="/inventoryTab" hx-target="#userContent" hx-swap="innerHTML">Inventory</button>
      <button hx-get="/skillsTab" hx-target="#userContent" hx-swap="innerHTML">Skills</button>
      <button hx-get="/clanTab" hx-target="#userContent" hx-swap="innerHTML">Clan</button>
      <br>
      <section id="userContent"></section>

      <br>
      <button hx-get="/loginForm" hx-target="#mainContent" hx-swap="innerHTML">Logout</button>
    </section>
  `;
}


export default router;
