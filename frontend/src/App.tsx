import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import UserContext from "./context/UserContext";
import AdminContext from "./context/AdminContext";

function App() {
  return (
    <>
      <UserContext>
        <AdminContext>
          <Navbar />
          <Outlet />
          <Footer />
        </AdminContext>
      </UserContext>
    </>
  );
}

export default App;
