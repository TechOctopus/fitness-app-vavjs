import { useState } from "react";

export const CarDialog = ({ car, updateCar }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(car.name);
  const [price, setPrice] = useState(car.price);
  const [img, setImg] = useState(car.img);

  async function updateCarForm(event) {
    event.preventDefault();
    event.target.reset();
    const updatedCar = { ...car, name, price, img };
    await updateCar(car.id, updatedCar);
    setOpen(!open);
  }

  function closeDialog() {
    setName(car.name);
    setPrice(car.price);
    setImg(car.img);
    setOpen(!open);
  }

  return (
    <>
      <button onClick={() => setOpen(!open)}>Update</button>
      <dialog open={open}>
        <p>Update {car.name}</p>
        <form onSubmit={(event) => updateCarForm(event)}>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="text"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
          <input
            type="text"
            value={img}
            onChange={(event) => setImg(event.target.value)}
          />
          <button>Save</button>
        </form>
        <button onClick={() => closeDialog()}>Cancel</button>
      </dialog>
    </>
  );
};
