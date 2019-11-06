import { useApolloClient } from "@apollo/react-hooks";
import Router from "next/router";
import { setToken } from "./session";

const useLogout = () => {
  const client = useApolloClient();
  return (resetToken: boolean = true) => {
    if (resetToken) {
      setToken("");
    }
    client.resetStore();
    Router.push("/");
  };
};

export default useLogout;
