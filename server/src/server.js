import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import { User, Ad, Method, connect } from "./db.js";
import { Op } from "sequelize";

const PORT = 3333;

const app = express();
app.use(express.json());
app.use(cors());

await connect().catch(process.exit);

async function authenticate(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const [type, token] = req.headers.authorization.split(" ");

    if (!token || type !== "Bearer") {
      return res.status(401).json({ message: "unauthorized" });
    }

    const payload = jwt.verify(token, "secret");
    const user = await User.findByPk(payload.id);
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "unauthorized" });
  }
}

async function admin(req, res, next) {
  if (req.user.name !== "admin") {
    return res.status(403).json({ message: "forbidden" });
  }
  next();
}

app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "failed" });
    }

    const user = await User.findOne({ where: { name, password } });
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

app.post("/register", async (req, res) => {
  try {
    const { email, name, password, age, height } = req.body;
    const user = await User.create({
      email,
      name,
      password,
      age,
      height,
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "failed" });
  }
});

app.get("/me", authenticate, (req, res) => {
  res.json(req.user);
});

app.get("/users", authenticate, admin, async (req, res) => {
  const users = await User.findAll({ where: { name: { [Op.ne]: "admin" } } });
  res.json(users);
});

app.post("/users", authenticate, admin, async (req, res) => {
  const { users } = req.body;
  await User.destroy({ where: { name: { [Op.ne]: "admin" } } });
  const newUsers = await User.bulkCreate(users);
  res.json(newUsers);
});

app.post("/user", authenticate, admin, async (req, res) => {
  const { email, name, password, age, height } = req.body;
  const user = await User.create({ email, name, password, age, height });
  res.json(user);
});

app.delete("/user/:id", authenticate, admin, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "not found" });
  }

  await user.destroy();
  res.json(user);
});

app.get("/ad", authenticate, async (req, res) => {
  const ad = await Ad.findOne();
  res.json(ad);
});

app.post("/ad/click", authenticate, async (req, res) => {
  const ad = await Ad.findOne();
  ad.click_count++;
  await ad.save();
  res.json(ad);
});

app.get("/ads", authenticate, admin, async (req, res) => {
  const ads = await Ad.findAll();
  res.json(ads);
});

app.put("/ad/:id", authenticate, admin, async (req, res) => {
  const ad = await Ad.findByPk(req.params.id);
  if (!ad) {
    return res.status(404).json({ message: "not found" });
  }

  const { image_url, target_url } = req.body;
  ad.image_url = image_url;
  ad.target_url = target_url;

  await ad.save();
  res.json(ad);
});

app.get("/methods", authenticate, async (req, res) => {
  const methods = await Method.findAll();
  res.json(methods);
});

app.post("/method", authenticate, admin, async (req, res) => {
  const { name, description } = req.body;
  const method = await Method.create({ name, description });
  res.json(method);
});

app.delete("/method/:id", authenticate, admin, async (req, res) => {
  const method = await Method.findByPk(req.params.id);
  if (!method) {
    return res.status(404).json({ message: "not found" });
  }

  await method.destroy();
  res.json(method);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🚀`);
});
