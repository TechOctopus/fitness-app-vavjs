import { Route, redirect } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MeasurementsPage from "./pages/MeasurementsPage";
import MethodsPage from "./pages/MethodsPage";
import StatisticsPage from "./pages/StatisticsPage";
import AdminPage from "./pages/AdminPage";
import AdPage from "./pages/AdPage";

import MainLayout from "./layouts/MainLayout";

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
  return user;
}

async function requireUnauth() {
  const user = await api("me");
  if (user) {
    return redirect("/measurements");
  }
  return null;
}

async function requireAdmin() {
  const user = await api("me");
  if (!user || user.name !== "admin") {
    return redirect("/login");
  }
  return user;
}

export default (
  <Route>
    <Route path="/" loader={handleRedirect} />
    <Route path="/login" element={<LoginPage />} loader={requireUnauth} />
    <Route path="/register" element={<RegisterPage />} loader={requireUnauth} />
    <Route element={<MainLayout />} loader={requireAuth}>
      <Route path="/measurements" element={<MeasurementsPage />} />
      <Route path="/methods" element={<MethodsPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="/ad" element={<AdPage />} />
      <Route path="/admin" element={<AdminPage />} loader={requireAdmin} />
    </Route>
  </Route>
);
