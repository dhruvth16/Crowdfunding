import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import UserSignin from "./pages/UserSignin.tsx";
import AdminSignup from "./pages/AdminSignup.tsx";
import UserSignup from "./pages/UserSignup.tsx";
import AdminSignin from "./pages/AdminSignin.tsx";
import ChooseRole from "./pages/ChooseRole.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
    ],
  },
  {
    path: "/userSignin",
    element: <UserSignin />,
  },
  {
    path: "/adminSignin",
    element: <AdminSignin />,
  },
  {
    path: "/userSignup",
    element: <UserSignup />,
  },
  {
    path: "/adminSignup",
    element: <AdminSignup />,
  },
  {
    path: "/role",
    element: <ChooseRole />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
