import axios from "axios";
import React from "react";
import { useQuery } from "@tanstack/react-query";

export type EvenementType = {
  id: number;
  name: string;
  date: string;
  desc: string;
  adresse: string;
  categoryName: string;
  type_eventName: string;
};

type GetProps = {
  resultParams: string[];
  filterParams: { name: string; value: string | number }[];
};

export type newEvent = {
  Name: string;
  date: string;
  desc_: string;
  adresse: string;
  Id_Category: number;
  Id_type_event: number;
};

export const useEvenement = {
  getEvenement: async function ({ resultParams, filterParams }: GetProps) {
    const response = await axios.post("http://localhost:3000/api/evenements", {
      resultParams: resultParams,
      filterParams: filterParams,
    });
    return response.data;
  },
  addEvenement: async function ({
    Name,
    date,
    desc_,
    adresse,
    Id_Category,
    Id_type_event,
  }: newEvent) {
    const now = new Date();
    const res = await axios.post("http://localhost:3000/api/evenements/new", {
      Name,
      date,
      desc_,
      creation_date: now.toISOString(),
      adresse,
      Id_type_event,
      Id_Category,
    });

    return res;
  },
  deleteEvenement: async function ({ id }: { id: number }) {
    const response = await axios.delete(
      `http://localhost:3000/api/evenements/${id}`
    );

    if (response.status === 200) {
      window.location.reload();
    }
    return response.data;
  },
};
