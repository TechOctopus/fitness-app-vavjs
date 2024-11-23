export default function MeasurmentsTable({ measurements }) {
  return (
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
  );
}
