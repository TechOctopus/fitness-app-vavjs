import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function MethodsPage() {
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    (async () => {
      const methods = await api("methods");
      setMethods(methods);
    })();
  }, []);

  async function handleDelete(id) {
    const methodToDelete = await api(`method/${id}`, "DELETE");
    setMethods(methods.filter((method) => method.id !== methodToDelete.id));
  }

  async function handleCreate(event) {
    event.preventDefault();

    const name = event.target[0].value;
    const description = event.target[1].value;

    event.target.reset();

    const method = await api("method", "POST", { name, description });

    setMethods([...methods, method]);
  }

  return (
    <div>
      <h1>Methods Page</h1>

      <form
        onSubmit={async (event) => await handleCreate(event)}
        className="pt-4"
      >
        <label>Name:</label>
        <input type="text" name="name" />

        <label>Description:</label>
        <input type="text" name="description" />

        <button type="submit">Create</button>
      </form>

      <table className="mt-8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {methods.length === 0 && (
            <tr>
              <td colSpan="3">No methods found</td>
            </tr>
          )}
          {methods.map((method) => (
            <tr key={method.id}>
              <td>{method.name}</td>
              <td>{method.description}</td>
              <td>
                <button
                  onClick={async () => handleDelete(method.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
