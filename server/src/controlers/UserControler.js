import { Router } from "express";

import { adminAuthMidalware } from "../midalware/AuthMidalware.js";
import { User } from "../db.js";
import { hash } from "../password.js";
import { Op } from "sequelize";

export const userRouter = Router();

userRouter.get("/users", adminAuthMidalware, async (req, res) => {
  const users = await User.findAll({ where: { name: { [Op.ne]: "admin" } } });
  res.json(users);
});

userRouter.get("/users/export", adminAuthMidalware, async (req, res) => {
  const users = await User.findAll({ where: { name: { [Op.ne]: "admin" } } });
  const csv = users
    .map(
      (user) =>
        `${user.email},${user.name},${user.password},${user.age},${user.height}`
    )
    .join("\n");
  res.set("Content-Type", "text/csv");
  res.send(csv);
});

userRouter.post("/users/import", adminAuthMidalware, async (req, res) => {
  const { data } = req.body;
  const users = data
    .split("\n")
    .map((line) => line.split(","))
    .map(([email, name, password, age, height]) => ({
      email,
      name,
      password,
      age,
      height,
    }));

  await User.destroy({ where: { name: { [Op.ne]: "admin" } } });
  const newUsers = await User.bulkCreate(users);
  res.json(newUsers);
});

userRouter.post("/user", adminAuthMidalware, async (req, res) => {
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
    res.status(400).json({ message: "error" });
  }
});

userRouter.delete("/user/:id", adminAuthMidalware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "not found" });
    }

    await user.destroy();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "error" });
  }
});
