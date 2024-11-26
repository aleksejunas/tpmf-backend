// TODO: Add the code from the backend copy
// TODO: Fix the firebase configuration in .env

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import * as dotenv from "dotenv";
import { verifyToken } from "./firebaseAdminConfig"

dotenv.config();

const app = express();
// const PORT = process.env || 4002;
const PORT = 4002;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  // fileFilter: (_req, file, cb: FileFilterCallback) => {
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/tiff"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".tiff"];

    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (
      allowedMimeTypes.includes(file.mimetype) &&
      allowedExtensions.includes(fileExtension)
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

app.use(cors());
app.use(express.json());

// Extend the Request interface to include the user property
declare module "express" {
  interface Request {
    user?: any;
  }
}

// Middleware for authentication
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send("Unauthorized");
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await verifyToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};

// Route for uploading files
// app.post(
//   "/upload",
//   authenticate,
//   upload.single("file"),
//   (req: Request, res: Response): void => {
//     if (!req.file) {
//       res.status(400).send("Bad Request");
//       return;
//     }

//     res.json({ message: "File uploaded successfully" });
//   },
// );

app.post('/upload', upload.single('file'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  if (req.file.size > 20 * 1024 * 1024) {
    res.status(400).send('File is too large.');
    return;
  }

  res.send(`File uploaded: ${req.file.filename}`);
});
// Add a route for GET /
app.get("/", (_req: Request, res: Response) => {
  res.send(
    "Welcome to the PodFiles backend server featuring nodemon for autoreloading of the server and web-browser-in-the-west upon code changes!",
  );
});


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
