import axios from "axios";

export type TypeEvent = {
  id: number;
  name: string
};

type GetProps = {
  resultParams: string[];
  filterParams: { name: string; value: string | number }[];
};

export const apiTypeEvent = {
  getTypeEvent: async function({resultParams, filterParams} : GetProps){
    const typeEvents = await axios.post("http://localhost:3000/api/typesevents", {
      resultParams,
      filterParams
    })

    return typeEvents.data as TypeEvent[]
  }
};
