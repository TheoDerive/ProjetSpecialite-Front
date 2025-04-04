import React from "react"
import { useAccountStore } from "~/datas/store"
import { apiMembre } from "./apiMembre"
import { useNavigate } from "react-router"

export type Me = {
  Id_Membre: number,
  firstname: string,
  lastname: string,
  email: string,
  is_admin: number | null,
  image_url: string
}

export enum AuthStatus {
  Unknow = 0,
  Authentificated = 1,
  Guest = 2
}

export const useAuth = () => {
  const { account, setAccount } = useAccountStore()
  let status = AuthStatus.Unknow

  switch (account) {
    case null:
      status = AuthStatus.Guest 
      break;

    case undefined:
      status = AuthStatus.Unknow 
      break;

    default:
      status = AuthStatus.Authentificated
      break;
  }

  const authenticate = React.useCallback(async () => {
    await apiMembre.getMe()
    .then(setAccount)
    .catch(() => setAccount(null))
  }, [])

  const login = React.useCallback(async (user: Me) => {
    setAccount(user)
  }, [])

  const logout = React.useCallback(async () => {
    setAccount(null)
  }, [])


  return {
    account,
    setAccount,
    status,
    authenticate,
    login,
    logout
  }
}
