import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import CreateUser from "../components/CreateUser";

export default function RegisterPage() {
  const navigate = useNavigate();

  async function handleRegister(user) {
    const result = await api("register", "POST", user);
    if (result) {
      navigate("/login");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1>Register Page</h1>
      <CreateUser callback={handleRegister} buttonText="Register" />
      <Link to="/login" className="pt-4">
        Already have an account? Login
      </Link>
    </main>
  );
}
