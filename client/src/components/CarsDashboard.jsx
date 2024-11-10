import { CarsTable } from "./CarsTable";
import { useState, useEffect } from "react";
import { api } from "../services/api";

export const CarsDashboard = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  async function creatCar(event) {
    event.preventDefault();
    const name = event.target[0].value;
    const price = event.target[1].value;
    const img = event.target[2].value;
    event.target.reset();
    const newCar = await api("cars", "POST", { name, price, img });
    setCars([...cars, newCar]);
  }

  async function readCars() {
    setLoading(true);
    const cars = await api("cars");
    setCars(cars);
    setLoading(false);
  }

  async function updateCar(id, car) {
    const updatedCar = await api(`cars/${id}`, "PUT", car);
    const updatedCars = cars.map((car) => (car.id === id ? updatedCar : car));
    setCars(updatedCars);
  }

  async function deleteCar(id) {
    await api(`cars/${id}`, "DELETE");
    const newCars = cars.filter((car) => car.id !== id);
    setCars(newCars);
  }

  useEffect(() => {
    (async () => await readCars())();
  }, [updateTrigger]);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => setUpdateTrigger(!updateTrigger)}>Refresh</button>
      <form onSubmit={(event) => creatCar(event)}>
        <input type="text" placeholder="Name" />
        <input type="number" placeholder="Price" />
        <input type="text" placeholder="Image" />
        <button>Add</button>
      </form>
      <CarsTable cars={cars} deleteCar={deleteCar} updateCar={updateCar} />
    </div>
  );
};
