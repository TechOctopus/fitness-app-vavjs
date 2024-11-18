import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const name = event.target[1].value;
    const password = event.target[2].value;
    const age = event.target[3].value;
    const height = event.target[4].value;
    event.target.reset();
    if (
      !email.trim() ||
      !name.trim() ||
      !password.trim() ||
      !age.trim() ||
      !height.trim()
    )
      return;
    const result = await api("register", "POST", {
      email,
      name,
      password,
      age,
      height,
    });
    if (result) {
      navigate("/login");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1>Register Page</h1>
      <form
        onSubmit={(event) => handleRegister(event)}
        className="grid gap-2 max-w-xs pt-4"
      >
        <label htmlFor="email">Email</label>
        <input type="email" placeholder="Email" />
        <label htmlFor="name">Name</label>
        <input type="text" placeholder="Name" />
        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" />
        <label htmlFor="age">Age</label>
        <input type="number" placeholder="Age" />
        <label htmlFor="height">Height</label>
        <input type="number" placeholder="Height" />
        <button type="submit" className="bg-blue-500 text-white rounded p-2">
          Register
        </button>
      </form>
      <Link to="/login" className="pt-4">
        Already have an account? Login
      </Link>
    </main>
  );
}
