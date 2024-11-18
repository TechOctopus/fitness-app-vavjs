import { useState, useEffect } from "react";
import { api } from "../services/api";

import FileTransfer from "./FileTransfer";
import CreateUser from "./CreateUser";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      await api("users").then((users) => setUsers(users));
    })();
  }, []);

  async function handleDelete(id) {
    const userToDelete = await api(`user/${id}`, "DELETE");
    setUsers(users.filter((user) => user.id !== userToDelete.id));
  }

  async function handleCreate(user) {
    const newUser = await api("user", "POST", user);
    setUsers([...users, newUser]);
  }

  return (
    <div className="mt-8">
      <h2>User Management</h2>

      <FileTransfer domain="users" updateData={setUsers} />

      <h3>Create User</h3>
      <CreateUser callback={handleCreate} buttonText="Create User" />

      <table className="border-collapse border table-auto mt-4">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Age</th>
            <th>Height</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={async () => await handleDelete(user.id)}
                  className="btn-warning"
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
