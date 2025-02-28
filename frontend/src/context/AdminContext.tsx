import { ReactNode, useState } from "react";
import { AdminDataContext } from "./AdminDataContext";

const AdminContext = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    address: "",
    phone_num: "",
  });

  return (
    <AdminDataContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export default AdminContext;
