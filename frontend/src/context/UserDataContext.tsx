import { createContext, Dispatch, SetStateAction } from "react";

type UserType = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  address: string;
  phone_num: string;
};

type UserContextType = {
  user: UserType;

  setUser: Dispatch<SetStateAction<UserType>>;
};

export const UserDataContext = createContext<UserContextType>({
  user: {
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    address: "",
    phone_num: "",
  },

  setUser: () => {},
});
