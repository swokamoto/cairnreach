import express from "express";
import accountsRouter from "./router/accountsRouter.js";
import characterRouter from "./router/characterRouter/characterIndex.js";

const app = express();

// Serve static files from public/
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(accountsRouter); 
app.use(characterRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));