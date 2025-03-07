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
import UserDashBoard from "./pages/UserDashBoard.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import UserProtectedWrapper from "./pages/UserProtectedWrapper.tsx";
import AdminProtectedWrapper from "./pages/AdminProtectedWrapper.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
      {
        path: "/user-dashboard",
        element: (
          <UserProtectedWrapper>
            <UserDashBoard />
          </UserProtectedWrapper>
        ),
      },
      {
        path: "/admin-dashboard",
        element: (
          <AdminProtectedWrapper>
            <AdminDashboard />
          </AdminProtectedWrapper>
        ),
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
