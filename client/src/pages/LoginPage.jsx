import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();
    const name = event.target[0].value;
    const password = event.target[1].value;
    event.target.reset();
    if (!name.trim() || !password.trim()) return;
    api("login", "POST", { name, password }).then((result) => {
      if (result) {
        localStorage.setItem("token", result.token);
        navigate("/measurements");
      }
    });
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl">Login</h1>
      <form
        onSubmit={(event) => handleLogin(event)}
        className="grid gap-2 max-w-xs pt-4"
      >
        <label htmlFor="name">Email</label>
        <input type="text" placeholder="Name" />
        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" />
        <button type="submit" className="bg-blue-500 text-white rounded p-2">
          Login
        </button>
      </form>
      <Link to="/register" className="pt-4">
        Don't have an account? Register
      </Link>
    </main>
  );
}
