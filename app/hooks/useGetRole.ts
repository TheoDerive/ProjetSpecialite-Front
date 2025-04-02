import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { EvenementType } from "./useEvenements";
import type { MembreType } from "./apiMembre";

export type GetRoleType = {
  id: number;
  Id_Evenement: number;
  Id_Membre: number;
  Id_roles: number;
  date: string;
  is_valid: number | null;
  evenement: EvenementType;
  membre: MembreType;
  role: {};
};

type GetProps = {
  resultParams: string[];
  filterParams: { name: string; value: string | number }[];
  needFetch?: boolean
};

export const useGetRole = {
  getRoles: async function ({ resultParams, filterParams, needFetch }: GetProps) {
    const response = await axios.post("http://localhost:3000/api/getRole", {
      resultParams: resultParams,
      filterParams: filterParams,
      needFetch: needFetch || false
    });
    return response.data;
  },
};
