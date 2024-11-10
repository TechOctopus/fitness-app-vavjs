import { Carstable } from "./Carstable";
import { useState, useEffect } from "react";
import { api } from "../services/api";

export const Dashboard = () => {
  const [cars, setCars] = useState([]);

  const getCars = async () => await api("cars");

  useEffect(() => {
    (async () => {
      const cars = await getCars();
      setCars(cars);
    })();
  }, []);

  const updateCars = async () => {
    const cars = await getCars();
    setCars(cars);
  };

  const addCar = async (event) => {
    event.preventDefault();
    const name = event.target[0].value;
    const price = event.target[1].value;
    const img = event.target[2].value;
    event.target.reset();

    const newCar = await api("cars", "POST", { name, price, img });
    setCars([...cars, newCar]);
  };

  const deleteCar = async (id) => {
    await api(`cars/${id}`, "DELETE");
    const newCars = cars.filter((car) => car.id !== id);
    setCars(newCars);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={updateCars}>Update</button>
      <form onSubmit={addCar}>
        <input type="text" placeholder="Name" />
        <input type="number" placeholder="Price" />
        <input type="text" placeholder="Image" />
        <button>Add</button>
      </form>
      <Carstable cars={cars} deleteCar={deleteCar} />
    </div>
  );
};
