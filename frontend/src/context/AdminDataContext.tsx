import { createContext, Dispatch, SetStateAction } from "react";

type AdminType = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  address: string;
  phone_num: string;
};

type AdminContextType = {
  admin: AdminType;

  setAdmin: Dispatch<SetStateAction<AdminType>>;
};

export const AdminDataContext = createContext<AdminContextType>({
  admin: {
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    address: "",
    phone_num: "",
  },

  setAdmin: () => {},
});
