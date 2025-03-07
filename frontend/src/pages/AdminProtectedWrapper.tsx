import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminProtectedWrapper({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("admin");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      await axios
        .get(`${import.meta.env.VITE_BASE_URL}/api/v1/campaign/campaigns`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          navigate("/");
        });
    };

    fetchData();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
      </div>
    );
  }

  return <div>{children}</div>;
}

export default AdminProtectedWrapper;
