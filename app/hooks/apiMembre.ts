import axios from "axios";

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

export const apiMembre = {
  login: async function ({ email, password }: LoginProps) {
    try {
      console.log(email, password)
      const response = await axios.post(
        "http://localhost:3000/api/membres/login",
        { email, password }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur API :", error.response?.data || error.message);
      throw error;
    }
  },
  signIn: async function ({ firstname, lastname, email, password }: SigninProps) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/membres/signin",
        { email, firstname, lastname, password, is_admin: false, image_url: "/" }
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
        "http://localhost:3000/api/membres/update/email",
        { id, email: newEmail }, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      console.error("Erreur API :", error.response?.data || error.message);
      throw error;
    }
  }
};
