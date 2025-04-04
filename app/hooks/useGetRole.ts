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
  roleName: {
    name: string,
    id: number
  };
};

type GetProps = {
  resultParams: string[];
  filterParams: { name: string; value: string | number }[];
  needFetch?: boolean
};

type addProps = {
  Id_Membre: number,
  Id_roles: number,
  Id_Evenement: number,
  date: string,
  isvalid: null
}

export const useGetRole = {
  getRoles: async function ({ resultParams, filterParams, needFetch }: GetProps) {
    const response = await axios.post("http://projetspe.theo-derive.mds-bordeaux.yt/api/getRole", {
      resultParams: resultParams,
      filterParams: filterParams,
      needFetch: needFetch || false
    });
    return response.data;
  },

  addRoles: async function ({ Id_roles, Id_Membre, isvalid, Id_Evenement, date  }: addProps) {
    const response = await axios.post("http://projetspe.theo-derive.mds-bordeaux.yt/api/getRole/new", {
      Id_Membre,
      Id_roles,
      Id_Evenement,
      isvalid,
      date
    });
    return response.data;
  },

  updateRole: async function({id}: {id: number}){
    const res = await axios.patch(`http://projetspe.theo-derive.mds-bordeaux.yt/api/getRole/isvalid/${id}`)

    return res
  }
};
