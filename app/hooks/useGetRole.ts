import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { EvenementType } from "./useEvenements";

export type GetRoleType = {
  id: number;
  Id_Evenement: number,
  Id_Membre: number,
  Id_roles: number,
  date: string,
  is_valid: number | null,
  evenement: EvenementType
  membre: {
     email: string,
    firstname: string,
    image_url: string,
    is_admin: string,
    lastname: string
  },
  role: {

  }
};

type GetProps = {
  resultParams: string[];
  filterParams: { name: string; value: string | number }[];
};

export const useGetRole = {
  getEvenement: function({ resultParams, filterParams }: GetProps) {
    const { data, isError, isPending, error } = useQuery({
      queryKey: ["getRole", filterParams],
      queryFn: async () => {
        const response = await axios.post(
          "http://localhost:3000/api/getRole",
          {
            resultParams: resultParams,
            filterParams: filterParams,
          }
        );
        return response.data;
      },
    });

    return { data, isError, isPending, error };
  },
};
