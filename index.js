import express from "express";
import accounts_router from "./router/accounts_router.js";

const app = express();

// Serve static files from public/
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(accounts_router); 

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));