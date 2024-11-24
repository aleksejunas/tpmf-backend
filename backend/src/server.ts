// TODO: Add the code from the backend copy
// Added a comment to git test

import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
// const PORT = process.env || 4002;
const PORT = 4002;

// Error handling: Add a middleware for error handling
app.use((err: Error, _req: Request, res: Response, _next: Function) => {
  console.error(err.message);
  res.status(500).send("Internal Server Error");
});

// Middleware (optional example)
app.use(express.json()); // Parse JSON request bodies

// Serve static files
app.use(express.static("public"));

// Custom API endpoints
app.post("/api/data", (req: Request, res: Response) => {
  const data = req.body;
  res.json({ message: "Data received!", data });
});

// Define a basic route
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello, TypeScript with Exprezzo-delight HALAL version!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
