import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
    event.target.reset();
    if (!email.trim() || !password.trim()) return;
    api("login", "POST", { email, password }).then((result) => {
      if (result) {
        localStorage.setItem("token", result.token);
        navigate("/measurements");
      }
    });
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1>Login</h1>
      <form onSubmit={(event) => handleLogin(event)}>
        <label htmlFor="email">Email</label>
        <input type="text" placeholder="Email" />
        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <Link to="/register" className="pt-4">
        Don't have an account? Register
      </Link>
    </main>
  );
}
