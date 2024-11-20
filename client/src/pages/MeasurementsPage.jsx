import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function MeasurementsPage() {
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    (async () => {
      await api("methods").then((methods) => setMethods(methods));
    })();
  }, []);

  const type = [
    {
      name: "Weight",
      key: "weight",
    },
    {
      name: "Systolic pressure",
      key: "systolic",
    },
    {
      name: "Diastolic pressure",
      key: "diastolic",
    },
  ];

  async function handleSubmit(event) {
    event.preventDefault();

    const measurement = event.target[0].value;
    const methodId = event.target[1].value;
    const value = event.target[2].value;
    const date = event.target[3].value;

    event.target.reset();

    await api("measurement", "POST", {
      measurement,
      methodId,
      value,
      date,
    });
  }

  return (
    <div>
      <h1>Create Measurement</h1>
      <form onSubmit={async (event) => handleSubmit(event)}>
        <label>Measurement:</label>
        <select required>
          {type.map((type) => (
            <option key={type.key} value={type.key}>
              {type.name}
            </option>
          ))}
        </select>
        <label>Method:</label>
        <select required>
          {methods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>

        <label>Value:</label>
        <input type="text" name="value" required />

        <label>Date:</label>
        <input type="date" name="date" required />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
