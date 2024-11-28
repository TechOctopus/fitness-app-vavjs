import express from "express";
import cors from "cors";

import { connectToDB } from "./db.js";
import { authRouter } from "./controlers/AuthControler.js";
import { userRouter } from "./controlers/UserControler.js";
import { adRouter } from "./controlers/AdControler.js";
import { methodRouter } from "./controlers/MethodControler.js";
import { measurementRouter } from "./controlers/MeasurementControler.js";

const PORT = 3333;
let isRunning = false;

const app = express();
app.use(express.json());
app.use(cors());

await connectToDB().catch(process.exit);

app.use(authRouter);
app.use(userRouter);
app.use(adRouter);
app.use(methodRouter);
app.use(measurementRouter);

app.get("/health", (req, res) => {
  if (isRunning) {
    return res.send("Server is running");
  }
  return res.status(500).send("Server is not running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🚀`);
  isRunning = true;
});
