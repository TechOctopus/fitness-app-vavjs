import { Route, redirect } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MeasurementsPage from "./pages/MeasurementsPage";
import MethodsPage from "./pages/MethodsPage";
import StatisticsPage from "./pages/StatisticsPage";
import AdminPage from "./pages/AdminPage";
import AdPage from "./pages/AdPage";

import AuthLayout from "./layouts/AuthLayout";

import { api } from "./services/api";

async function handleRedirect() {
  const user = await api("me");
  if (!user) {
    return redirect("/login");
  } else if (user.name === "admin") {
    return redirect("/admin");
  }
  return redirect("/measurements");
}

async function requireAuth() {
  const user = await api("me");
  if (!user) {
    return redirect("/login");
  }
  return null;
}

async function requireUnauth() {
  const user = await api("me");
  if (user) {
    return redirect("/measurements");
  }
  return null;
}

export default (
  <Route>
    <Route path="/" loader={handleRedirect} />
    <Route path="/login" element={<LoginPage />} loader={requireUnauth} />
    <Route path="/register" element={<RegisterPage />} loader={requireUnauth} />
    <Route element={<AuthLayout />}>
      <Route
        path="/measurements"
        element={<MeasurementsPage />}
        loader={requireAuth}
      />
      <Route path="/methods" element={<MethodsPage />} loader={requireAuth} />
      <Route
        path="/statistics"
        element={<StatisticsPage />}
        loader={requireAuth}
      />
      <Route path="/ad" element={<AdPage />} loader={requireAuth} />
    </Route>
    <Route path="/admin" element={<AdminPage />} loader={requireAuth} />
  </Route>
);
