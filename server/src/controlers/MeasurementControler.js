import { Router } from "express";

import { userAuthMidalware } from "../midalware/AuthMidalware.js";
import { Weight, Systolic, Diastolic, Method } from "../db.js";

export const measurementRouter = Router();

measurementRouter.get("/measurements", userAuthMidalware, async (req, res) => {
  const weights = await Weight.findAll({
    where: { user_id: req.user.id },
  });

  const weightToSent = await Promise.all(
    weights.map(async (w) => {
      const method = await Method.findByPk(w.method_id);
      return {
        name: "Weight",
        value: w.value,
        date: w.date,
        method: method.name,
      };
    })
  );

  const systolics = await Systolic.findAll({
    where: { user_id: req.user.id },
  });

  const systolicToSent = await Promise.all(
    systolics.map(async (s) => {
      const method = await Method.findByPk(s.method_id);
      return {
        name: "Systolic pressure",
        value: s.value,
        date: s.date,
        method: method.name,
      };
    })
  );

  const diastolics = await Diastolic.findAll({
    where: { user_id: req.user.id },
  });

  const diastolicToSent = await Promise.all(
    diastolics.map(async (d) => {
      const method = await Method.findByPk(d.method_id);
      return {
        name: "Diastolic pressure",
        value: d.value,
        date: d.date,
        method: method.name,
      };
    })
  );

  const toSend = [...weightToSent, ...systolicToSent, ...diastolicToSent].sort(
    (a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA < dateB) {
        return -1;
      }

      if (dateA > dateB) {
        return 1;
      }

      return 0;
    }
  );

  res.json(toSend);
});

measurementRouter.post("/measurement", userAuthMidalware, async (req, res) => {
  const { measurement, methodId, value, date } = req.body;

  switch (measurement) {
    case "weight":
      await Weight.create({
        user_id: req.user.id,
        method_id: methodId,
        value,
        date,
      });
      break;
    case "systolic":
      await Systolic.create({
        user_id: req.user.id,
        method_id: methodId,
        value,
        date,
      });
      break;
    case "diastolic":
      await Diastolic.create({
        user_id: req.user.id,
        method_id: methodId,
        value,
        date,
      });
      break;
  }

  res.json({ message: "Measurement created" });
});
