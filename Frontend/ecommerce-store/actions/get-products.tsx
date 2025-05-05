import qs from "query-string";

import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_URL}/products`

interface Query{
  categoryId?:string;
  colorId?:string;
  sizeId?:string;
  isFeatured?:boolean;
  sort?: 'asc' | 'desc';
}

const getProducts = async (query:Query): Promise<Product[]> => {
  const url =qs.stringifyUrl({
    url:URL,
    query:{
      colorId:query.colorId,
      sizeId:query.sizeId,
      categoryId:query.categoryId,
      isFeatured: query.isFeatured,
      sort: query.sort,
    }

  })
  const res = await fetch(url);

  return res.json();
};

export default getProducts;