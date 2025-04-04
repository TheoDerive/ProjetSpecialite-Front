import axios from "axios";

export type Category = {
  id: number;
  name: string
};

type GetProps = {
  resultParams: string[];
  filterParams: { name: string; value: string | number }[];
};

export const apiCategory = {
  getCategory: async function({resultParams, filterParams} : GetProps){
    const category = await axios.post("http://projetspe.theo-derive.mds-bordeaux.yt/api/category", {
      resultParams,
      filterParams
    })

    return category.data as Category[]
  }
};
