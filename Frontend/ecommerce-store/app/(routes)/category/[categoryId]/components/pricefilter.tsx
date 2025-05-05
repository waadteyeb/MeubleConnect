"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";


interface FilterPriceProps {
  name: string;
  valueKey: string;
}



const FilterPrice: React.FC<FilterPriceProps> = ({ name, valueKey }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedSortValue = searchParams.get(valueKey);

  const onPriceSortClick = (sort: 'asc' | 'desc') => {
    const current = qs.parse(searchParams.toString());

    const query = {
      ...current,
      [valueKey]: sort,
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold">{name}</h3>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-2">
        <Button
          className={cn(
            'rounded-md text-sm text-gray-800 p-2 bg-white border border-gray-300',
            selectedSortValue === 'asc' && 'bg-black text-white'
          )}
          onClick={() => onPriceSortClick('asc')}
        >
           Ascendant
        </Button>
        <Button
          className={cn(
            'rounded-md text-sm text-gray-800 p-2 bg-white border border-gray-300',
            selectedSortValue === 'desc' && 'bg-black text-white'
          )}
          onClick={() => onPriceSortClick('desc')}
        >
          Descendant
        </Button>
      </div>
    </div>
  );
};

export default FilterPrice;
