import axios from "axios";
import { ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserDataContext";

function UserProtectedWrapper({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  console.log("Token:: ", token);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      await axios
        .get(`${import.meta.env.VITE_BASE_URL}/campaign/campaigns`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          navigate("/");
        });
    };

    fetchData();
  }, [token, navigate, setUser]);

  console.log("Loadin:: ", loading);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
      </div>
    );
  }

  return <div>{children}</div>;
}

export default UserProtectedWrapper;
