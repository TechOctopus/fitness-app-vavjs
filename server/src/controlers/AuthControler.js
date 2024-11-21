import jwt from "jsonwebtoken";

import { Router } from "express";
import { User } from "../db.js";
import { hash, verify } from "../password.js";

import { userAuthMidalware } from "../midalware/AuthMidalware.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "failed" });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user || !verify(password, user.password)) {
      return res.status(401).json({ message: "failed" });
    }

    if (!user) {
      return res.status(401).json({ message: "failed" });
    }

    const token = jwt.sign({ id: user.id }, "secret");

    res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "failed" });
  }
});

authRouter.post("/register", async (req, res) => {
  try {
    const { email, name, password, age, height } = req.body;
    const user = await User.create({
      email,
      name,
      password: hash(password),
      age,
      height,
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "failed" });
  }
});

authRouter.get("/me", userAuthMidalware, (req, res) => {
  res.json(req.user);
});
