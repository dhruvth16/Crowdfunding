import { ReactNode, useState } from "react";
import { UserDataContext } from "./UserDataContext";

const UserContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    address: "",
    phone_num: "",
  });

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
