import { useState, useEffect } from "react";
import { api } from "../services/api";

import { AdDialog } from "../components/AdDialog";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    (async () => {
      await api("users").then((users) => setUsers(users));
      await api("ads").then((ads) => setAds(ads));
    })();
  }, []);

  async function handleDelete(id) {
    const userToDelete = await api(`user/${id}`, "DELETE");
    setUsers(users.filter((user) => user.id !== userToDelete.id));
  }

  async function handleCreate(event) {
    event.preventDefault();
    const form = event.target;
    const user = {
      email: form.email.value,
      name: form.name.value,
      password: form.password.value,
      age: form.age.value,
      height: form.height.value,
    };
    const newUser = await api("user", "POST", user);
    setUsers([...users, newUser]);
    form.reset();
  }

  async function handleImport(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsText(file);
    reader.onload = async (event) => {
      const users = JSON.parse(event.target.result);
      const newUsers = await api("users", "POST", { users });
      setUsers([...newUsers]);
    };

    event.target.value = "";
  }

  async function handleExport() {
    const data =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(users));
    const link = document.createElement("a");
    link.href = data;
    link.download = "users.json";
    link.click();
    link.remove();
  }

  async function handleUpdateAd(ad) {
    const updatedAd = await api(`ad/${ad.id}`, "PUT", ad);
    setAds(ads.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)));
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <div>
        <h2>Users</h2>
        <input
          type="file"
          accept=".json"
          onChange={async (event) => handleImport(event)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        />
        <button
          onClick={async () => await handleExport()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Export
        </button>
        <form onSubmit={async (event) => await handleCreate(event)}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border"
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            className="border"
          />
          <input
            type="number"
            name="height"
            placeholder="Height"
            className="border"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create
          </button>
        </form>
      </div>
      <table className="border-collapse border">
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
              <td>{user.height}</td>
              <td>
                <button
                  onClick={async () => await handleDelete(user.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Ads</h2>
      <table className="border-collapse border">
        <thead>
          <tr>
            <th>Img</th>
            <th>Link</th>
            <th>Clicks Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr key={ad.id}>
              <td>
                <img src={ad.image_url} alt={ad.image_url} className="h-20" />
              </td>
              <td>{ad.target_url}</td>
              <td>{ad.click_count}</td>
              <td>
                <AdDialog ad={ad} handleUpdateAd={handleUpdateAd} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
