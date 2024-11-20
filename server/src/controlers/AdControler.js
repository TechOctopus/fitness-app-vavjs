import { Ad } from "../db.js";
import { Router } from "express";
import {
  userAuthMidalware,
  adminAuthMidalware,
} from "../midalware/AuthMidalware.js";

export const adRouter = Router();

adRouter.get("/ad", userAuthMidalware, async (req, res) => {
  const ad = await Ad.findOne();
  res.json(ad);
});

adRouter.post("/ad/click", userAuthMidalware, async (req, res) => {
  const ad = await Ad.findOne();
  ad.click_count++;
  await ad.save();
  res.json(ad);
});

adRouter.get("/ads", adminAuthMidalware, async (req, res) => {
  const ads = await Ad.findAll();
  res.json(ads);
});

adRouter.put("/ad/:id", adminAuthMidalware, async (req, res) => {
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
