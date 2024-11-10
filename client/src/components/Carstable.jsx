import { CarDialog } from "./CarDialog";

export const CarsTable = ({ cars, deleteCar, updateCar }) => (
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Price</th>
        <th>Image</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {cars.length === 0 ? (
        <tr>
          <td colSpan="4">No data</td>
        </tr>
      ) : (
        cars.map((car) => (
          <tr key={car.id}>
            <td>{car.name}</td>
            <td>{car.price}</td>
            <td>
              <img src={car.img} alt={car.name} style={{ width: "100px" }} />
            </td>
            <td>
              <button onClick={() => deleteCar(car.id)}>Delete</button>
              <CarDialog car={car} updateCar={updateCar} />
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);
