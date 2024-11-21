import { Router } from "express";

import { userAuthMidalware } from "../midalware/AuthMidalware.js";
import { Weight, Systolic, Diastolic, Method } from "../db.js";

import { Op } from "sequelize";

export const measurementRouter = Router();

measurementRouter.get("/measurements", userAuthMidalware, async (req, res) => {
  const { filter, methodName, startDate, endDate } = req.query;

  const optObj = {
    where: { user_id: req.user.id },
    order: [["date", "ASC"]],
    include: [
      {
        model: Method,
        attributes: ["name"],
      },
    ],
  };

  if (startDate && endDate) {
    optObj.where.date = {
      [Op.between]: [startDate, endDate],
    };
  }

  if (methodName && methodName !== "all") {
    optObj.include[0].where = { name: methodName };
  }

  switch (filter) {
    case "weight": {
      const weights = await Weight.findAll(optObj);

      res.json(
        weights.map((w) => {
          return {
            name: "Weight",
            value: w.value,
            date: w.date,
            method: w.Method.name,
          };
        })
      );
      break;
    }

    case "systolic": {
      const systolics = await Systolic.findAll(optObj);

      res.json(
        systolics.map((s) => {
          return {
            name: "Systolic pressure",
            value: s.value,
            date: s.date,
            method: s.Method.name,
          };
        })
      );
      break;
    }

    case "diastolic": {
      const diastolics = await Diastolic.findAll(optObj);

      res.json(
        diastolics.map((d) => {
          return {
            name: "Diastolic pressure",
            value: d.value,
            date: d.date,
            method: d.Method.name,
          };
        })
      );
      break;
    }
  }
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
