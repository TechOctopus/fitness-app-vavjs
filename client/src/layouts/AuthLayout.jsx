import { Outlet, Link, useNavigate } from "react-router-dom";

export default function AuthLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <>
      <header className="bg-gray-800 text-white p-4 w-full">
        <nav className="flex justify-between max-w-4xl mx-auto">
          <ul className="flex space-x-4">
            <li>
              <Link to="/measurements">Measurements</Link>
            </li>
            <li>
              <Link to="/methods">Methods</Link>
            </li>
            <li>
              <Link to="/statistics">Statistics</Link>
            </li>
            <li>
              <Link to="/ad">Ad</Link>
            </li>
          </ul>
          <button
            className="bg-blue-500 text-white rounded p-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}
