import { Router } from "express";
import db from "../../dbConnection.js";

const characterRouter = Router();

characterRouter.get("/characterMain", (req, res) => {
    const id = req.query.id;
    console.log(id);

    // Fetch the user details from the database using the user ID
    const user = db.query(`
        SELECT users.id, users.name, Class.name AS class
        FROM users
        LEFT JOIN Class ON users.class_id = Class.id
        WHERE users.id = ?
    `).get([id]);

    if (user) {
        res.send(characterMain(user));
    } else {
        res.status(404).send('<p>Error: User not found</p>');
    }
});

function characterMain(user) {
    console.log("Character Main FE: " + JSON.stringify(user));
    let characterHtml = `
    <section id="userDashboard">
      <h1>Welcome, ${user.name}!</h1>
      <p>Class: ${user.class}</p>
      <button hx-get="/characterMain?id=${user.id}" hx-target="#mainContent" hx-swap="innerHTML">Refresh</button>
    </section>
  `;
    return characterHtml;
}

export default characterRouter;