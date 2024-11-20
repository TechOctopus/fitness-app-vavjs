import { Method } from "../db.js";
import { Router } from "express";
import { userAuthMidalware } from "../midalware/AuthMidalware.js";

export const methodRouter = Router();

methodRouter.get("/methods", userAuthMidalware, async (req, res) => {
  const methods = await Method.findAll();
  res.json(methods);
});

methodRouter.post("/method", userAuthMidalware, async (req, res) => {
  const { name, description } = req.body;
  const method = await Method.create({ name, description });
  res.json(method);
});

methodRouter.delete("/method/:id", userAuthMidalware, async (req, res) => {
  const method = await Method.findByPk(req.params.id);
  if (!method) {
    return res.status(404).json({ message: "not found" });
  }

  await method.destroy();
  res.json(method);
});
