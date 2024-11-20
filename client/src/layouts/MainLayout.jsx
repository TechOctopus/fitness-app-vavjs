import { Outlet, Link, useNavigate, useLoaderData } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();
  const user = useLoaderData();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <>
      <header className="bg-gray-800 text-white w-full">
        <nav className="flex justify-between p-4 max-w-4xl mx-auto">
          <ul className="flex items-center space-x-4">
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
            {user.name === "admin" && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
          </ul>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}
