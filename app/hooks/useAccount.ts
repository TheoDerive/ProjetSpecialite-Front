import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";
import React from "react";

export const useAccount = () => {
  const { account, setAccount } = useAuth();

  if (!account) {
    throw new Error("User not auth");
  }

  function updateEmail(value: string) {
    setAccount({
      ...account,
      email: value,
    });
  }

  return {
    account,
    updateEmail,
  };
};
