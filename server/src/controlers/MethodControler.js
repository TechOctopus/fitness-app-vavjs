import { Method } from "../db.js";
import { Router } from "express";
import { userAuthMidalware } from "../midalware/AuthMidalware.js";

export const methodRouter = Router();

methodRouter.get("/methods", userAuthMidalware, async (req, res) => {
  try {
    const methods = await Method.findAll();
    res.json(methods);
  } catch (error) {
    res.status(400).json({ message: "error" });
  }
});

methodRouter.post("/method", userAuthMidalware, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name === "" || !description || description === "") {
      return res.status(400).json({ message: "error" });
    }
    const method = await Method.create({ name, description });
    res.json(method);
  } catch (error) {
    res.status(400).json({ message: "error" });
  }
});

methodRouter.delete("/method/:id", userAuthMidalware, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "error" });
    }

    const method = await Method.findByPk(req.params.id);
    if (!method) {
      return res.status(404).json({ message: "not found" });
    }

    await method.destroy();
    res.json(method);
  } catch (error) {
    res.status(400).json({ message: "error" });
  }
});
