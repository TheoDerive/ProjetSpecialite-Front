import axios from "axios";
import React from "react";
import { useQuery } from "@tanstack/react-query";

type EvenementType = {
  id: number;
  name: string;
  date: string;
  desc: string;
  adresse: string;
  category_name: string;
  type_event_name: string;
};

type GetProps = {
  resultParams: string[];
  filterParams: { name: string; value: string }[];
};

export const useEvenement = {
  getEvenement: function({ resultParams, filterParams }: GetProps) {
    const { data, isError, isPending, error } = useQuery({
      queryKey: ["evenments"],
      queryFn: async () => {
        const response = await axios.post(
          "http://localhost:3000/api/evenements",
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
