import pg from "pg";
import express from "express";
import cors from "cors";

const PORT = 3333;

const app = express();
app.use(express.json());
app.use(cors());

const client = new pg.Client({
  user: "postgres",
  password: "postgres",
  host: "db",
  port: 5432,
  database: "shop",
});

await client.connect();

app.post("/cars", async (req, res) => {
  const { name, price, img } = req.body;
  const result = await client.query(
    "INSERT INTO cars (name, price, img) VALUES ($1, $2, $3) RETURNING *",
    [name, price, img]
  );
  const createdCar = result.rows[0];
  res.json(createdCar);
});

app.get("/cars", async (req, res) => {
  const result = await client.query("SELECT * FROM cars");
  const cars = result.rows;
  res.json(cars);
});

app.put("/cars/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, img } = req.body;
  const result = await client.query(
    "UPDATE cars SET name = $1, price = $2, img = $3 WHERE id = $4 RETURNING *",
    [name, price, img, id]
  );
  const updatedCar = result.rows[0];
  res.json(updatedCar);
});

app.delete("/cars/:id", async (req, res) => {
  const { id } = req.params;
  const result = await client.query(
    "DELETE FROM cars WHERE id = $1 RETURNING *",
    [id]
  );
  const deletedCar = result.rows[0];
  res.json(deletedCar);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🚀`);
});
