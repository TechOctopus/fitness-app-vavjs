import { User } from "../db.js";
import jwt from "jsonwebtoken";

export async function userAuthMidalware(req, res, next) {
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

export async function adminAuthMidalware(req, res, next) {
  userAuthMidalware(req, res, () => {
    if (req.user.name !== "admin") {
      return res.status(403).json({ message: "forbidden" });
    }
    next();
  });
}
