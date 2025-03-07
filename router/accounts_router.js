import { Router } from "express";
import { Database } from "bun:sqlite";

const router = Router();
const db = new Database("database.sqlite");

// Serve users
router.get("/data", (req, res) => {
  const users = db.query("SELECT * FROM users").all();
  res.json(users);
});

// Add more routes as needed...

export default router;
