import { useState, useEffect } from "react";
import { api } from "../services/api";
import Graph from "../components/Graph";
import MeasurmentsTable from "../components/MeasurmentsTable";

export default function StatisticsPage() {
  const [measurements, setMeasurements] = useState([]);
  const [methodNames, setMethodNames] = useState([]);

  const [filter, setFilter] = useState({
    name: "weight",
    startDate: "",
    endDate: "",
    methodName: "",
  });

  useEffect(() => {
    (async () => {
      await api("methods").then((data) => {
        const methodNamesPlusAll = data.map((method) => method.name);
        methodNamesPlusAll.unshift("all");
        setMethodNames(methodNamesPlusAll);
        if (data.length > 0) {
          setFilter({ ...filter, methodName: data[0].name });
        }
      });

      await api(
        `measurements?filter=${filter.name}&methodName=${filter.methodName}&startDate=${filter.startDate}&endDate=${filter.endDate}`
      ).then((data) => {
        if (data === undefined) {
          return;
        }

        setMeasurements(data);
        const startDate =
          data.length === 0
            ? ""
            : new Date(data[0].date).toISOString().split("T")[0];
        const endDate =
          data.length === 0
            ? ""
            : new Date(data[data.length - 1].date).toISOString().split("T")[0];

        setFilter({
          ...filter,
          startDate: startDate,
          endDate: endDate,
        });
      });
    })();
  }, []);

  async function handleFilter() {
    const data = await api(
      `measurements?filter=${filter.name}&methodName=${filter.methodName}&startDate=${filter.startDate}&endDate=${filter.endDate}`
    );
    setMeasurements(data);
  }

  async function handleResetFilter() {
    setFilter({ name: "weight", startDate: "", endDate: "" });
    const data = await api(`measurements?filter=weight`);
    setMeasurements(data);
  }

  return (
    <div>
      <h1>Statistics Page</h1>

      <div className="flex flex-col max-w-sm space-y-4 mt-4">
        <label>Filter by:</label>
        <select
          onChange={(event) =>
            setFilter({ ...filter, name: event.target.value })
          }
          value={filter.name}
        >
          <option value="weight">Weight</option>
          <option value="systolic">Systolic pressure</option>
          <option value="diastolic">Diastolic pressure</option>
        </select>

        <label>Method</label>
        <select
          onChange={(event) =>
            setFilter({ ...filter, methodName: event.target.value })
          }
          value={filter.methodName}
        >
          {methodNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <label>Start date</label>
        <input
          type="date"
          onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
          value={filter.startDate}
        />

        <label>End date</label>
        <input
          type="date"
          onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
          value={filter.endDate}
        />

        <button onClick={async () => await handleFilter()} className="mt-4">
          Filter
        </button>

        <button
          onClick={() => handleResetFilter()}
          className="mt-4 btn-warning"
        >
          Reset filter
        </button>
      </div>

      <Graph rawData={measurements} />
      <MeasurmentsTable measurements={measurements} />
    </div>
  );
}
