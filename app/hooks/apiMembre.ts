import axios from "axios";
import type { Me } from "./useAuth";

export type MembreType = {
  id: number;
  email: string;
  firstname: string;
  image_url: string;
  is_admin: string;
  lastname: string;
};

type LoginProps = {
  email: string,
  password: string
};

type SigninProps = {
  firstname: string,
  lastname: string,
  email: string,
  password: string
};

type GetProps = {
  resultParams: string[];
  filterParams: { name: string; value: string | number }[];
};

export const apiMembre = {
  login: async function ({ email, password }: LoginProps) {
    try {
      console.log(email, password)
      const response = await axios.post(
        "http://projetspe.theo-derive.mds-bordeaux.yt/api/membres/login",
        { email, password }, { withCredentials: true}
      );
      return response.data;
    } catch (error) {
      console.error("Erreur API :", error.response?.data || error.message);
      throw error;
    }
  },
  logout: async function ({ id } : { id: number }) {
    try {
      const response = await axios.patch(
        "http://projetspe.theo-derive.mds-bordeaux.yt/api/membres/logout",
        { id }, { withCredentials: true}
      );
      return response.data;
    } catch (error) {
      console.error("Erreur API :", error.response?.data || error.message);
      throw error;
    }
  },

  getMembres: async function ({ filterParams, resultParams }: GetProps) {
    try {
      const response = await axios.post(
        "http://projetspe.theo-derive.mds-bordeaux.yt/api/membres",
        { resultParams, filterParams }, { withCredentials: true}
      );
      return response.data;
    } catch (error) {
      console.error("Erreur API :", error.response?.data || error.message);
      throw error;
    }
  },
  getMe: async function() {
    try {
      const response = await axios.get(
        "http://projetspe.theo-derive.mds-bordeaux.yt/api/membres/me",
        { withCredentials: true}
      );
  console.log("get")
      return response.data as Me;
    } catch (error) {
      console.error("Erreur API :", error.response?.data || error.message);
      throw error;
    }
  },
  signIn: async function ({ firstname, lastname, email, password }: SigninProps) {
    try {
      const response = await axios.post(
        "http://projetspe.theo-derive.mds-bordeaux.yt/api/membres/signin",
        { email, firstname, lastname, password, is_admin: false, image_url: "/" },
        { withCredentials: true}
      );
      return response.data;
    } catch (error) {
      console.error("Erreur API :", error.response?.data || error.message);
      throw error;
    }
  },
  updateEmail: async function ({ id, newEmail }: {id: number, newEmail: string}){
    try {
      const response = await axios.patch(
        "http://projetspe.theo-derive.mds-bordeaux.yt/api/membres/update/email",
        { id, email: newEmail }, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      console.error("Erreur API :", error.response?.data || error.message);
      throw error;
    }
  },
  updatePassword: async function ({ id, old_password, password }: {id: number, old_password: string, password: string}){
    try {
      const response = await axios.patch(
        "http://projetspe.theo-derive.mds-bordeaux.yt/api/membres/update/password",
        { id, old_password, password }, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      console.error("Erreur API :", error.response?.data || error.message);
      throw error;
    }
  },
  delete: async function ({ id}: {id: number}){
    try {
      const response = await axios.delete(
        `http://projetspe.theo-derive.mds-bordeaux.yt/api/membres/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur API :", error.response?.data || error.message);
      throw error;
    }
  }
};
