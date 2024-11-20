import { useState, useEffect } from "react";
import { api } from "../services/api";
import Graph from "../components/Graph";

export default function StatisticsPage() {
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    (async () => {
      await api("measurements").then((measurements) =>
        setMeasurements(measurements)
      );
    })();
  }, []);

  return (
    <div>
      <h1>Statistics Page</h1>

      <Graph rawData={measurements} />

      <table className="mt-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>Method</th>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {measurements.length === 0 && (
            <tr colSpan="4">
              <td>No data</td>
            </tr>
          )}
          {measurements.length !== 0 &&
            measurements.map((measurement) => (
              <tr key={`${measurement.date}-${measurement.name}`}>
                <td>{measurement.date}</td>
                <td>{measurement.method}</td>
                <td>{measurement.name}</td>
                <td>{measurement.value}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
