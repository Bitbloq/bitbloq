import React, { FC, createContext, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { ME_QUERY } from "../apollo/queries";
import Loading from "../components/Loading";

export const UserDataContext = createContext<any>(null);

const useUserData = () => useContext(UserDataContext);

export default useUserData;
