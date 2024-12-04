import { Router } from "express";

import { userAuthMidalware } from "../midalware/AuthMidalware.js";
import { Weight, Systolic, Diastolic, Method } from "../db.js";

import { Op } from "sequelize";

export const measurementRouter = Router();

measurementRouter.get("/measurements", userAuthMidalware, async (req, res) => {
  try {
    const { filter = "all", methodName, startDate, endDate } = req.query;

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

      default: {
        const weights = await Weight.findAll(optObj);
        const systolics = await Systolic.findAll(optObj);
        const diastolics = await Diastolic.findAll(optObj);

        const measurements = [
          ...weights.map((w) => {
            return {
              name: "Weight",
              value: w.value,
              date: w.date,
              method: w.Method.name,
            };
          }),
          ...systolics.map((s) => {
            return {
              name: "Systolic pressure",
              value: s.value,
              date: s.date,
              method: s.Method.name,
            };
          }),
          ...diastolics.map((d) => {
            return {
              name: "Diastolic pressure",
              value: d.value,
              date: d.date,
              method: d.Method.name,
            };
          }),
        ].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });

        res.json(measurements);
      }
    }
  } catch (error) {
    res.status(400).json({ error: "error" });
  }
});

measurementRouter.post("/measurement", userAuthMidalware, async (req, res) => {
  try {
    const { measurement, methodId, value, date } = req.body;

    const method = await Method.findByPk(methodId);
    if (!method) {
      res.status(400).json({ error: "Method not found" });
      return;
    }

    switch (measurement) {
      case "weight": {
        await Weight.create({
          user_id: req.user.id,
          method_id: methodId,
          value,
          date,
        });

        res.json({
          name: "Weight",
          value,
          date,
          method: method.name,
        });

        break;
      }

      case "systolic": {
        await Systolic.create({
          user_id: req.user.id,
          method_id: methodId,
          value,
          date,
        });

        res.json({
          name: "Systolic pressure",
          value,
          date,
          method: method.name,
        });

        break;
      }

      case "diastolic": {
        await Diastolic.create({
          user_id: req.user.id,
          method_id: methodId,
          value,
          date,
        });

        res.json({
          name: "Diastolic pressure",
          value,
          date,
          method: method.name,
        });

        break;
      }
    }
  } catch (error) {
    res.status(400).json({ error: "error" });
  }
});

measurementRouter.get(
  "/measurements/export",
  userAuthMidalware,
  async (req, res) => {
    try {
      const optObj = {
        where: { user_id: req.user.id },
        include: [
          {
            model: Method,
            attributes: ["name"],
          },
        ],
      };

      const weights = await Weight.findAll(optObj);
      const systolics = await Systolic.findAll(optObj);
      const diastolics = await Diastolic.findAll(optObj);

      const measurements = [
        ...weights.map((w) => {
          return {
            name: "Weight",
            value: w.value,
            date: w.date,
            method: w.Method.name,
          };
        }),
        ...systolics.map((s) => {
          return {
            name: "Systolic pressure",
            value: s.value,
            date: s.date,
            method: s.Method.name,
          };
        }),
        ...diastolics.map((d) => {
          return {
            name: "Diastolic pressure",
            value: d.value,
            date: d.date,
            method: d.Method.name,
          };
        }),
      ].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });

      const csv = measurements
        .map((m) => `${m.name},${m.value},${m.date},${m.method}`)
        .join("\n");

      res.set("Content-Type", "text/csv");
      res.send(csv);
    } catch (error) {
      res.status(400).json({ error: "error" });
    }
  }
);

measurementRouter.post(
  "/measurements/import",
  userAuthMidalware,
  async (req, res) => {
    try {
      const { data } = req.body;

      // Delete all user measurements
      await Weight.destroy({ where: { user_id: req.user.id } });
      await Systolic.destroy({ where: { user_id: req.user.id } });
      await Diastolic.destroy({ where: { user_id: req.user.id } });

      const measurements = data
        .split("\n")
        .map((line) => line.split(","))
        .map(([name, value, date, method]) => ({
          name,
          value,
          date,
          method,
        }));

      for (const m of measurements) {
        const method = await Method.findOne({ where: { name: m.method } });
        if (!method) {
          res.status(400).json({ error: "Method not found" });
          return;
        }

        switch (m.name) {
          case "Weight": {
            await Weight.create({
              user_id: req.user.id,
              method_id: method.id,
              value: m.value,
              date: m.date,
            });

            break;
          }

          case "Systolic pressure": {
            await Systolic.create({
              user_id: req.user.id,
              method_id: method.id,
              value: m.value,
              date: m.date,
            });

            break;
          }

          case "Diastolic pressure": {
            await Diastolic.create({
              user_id: req.user.id,
              method_id: method.id,
              value: m.value,
              date: m.date,
            });

            break;
          }
        }
      }

      res.json(measurements);
    } catch (error) {
      res.status(400).json({ error: "error" });
    }
  }
);
