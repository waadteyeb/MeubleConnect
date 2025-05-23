import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";


interface InfoProps {
  data: Product
};


const Info: React.FC<InfoProps> = ({ data }) => {
  return ( 
    <div>
       <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
       <div className="mt-3 flex items-end justify-between">
       <p className="text-2xl text-gray-900">
       <Currency value={data?.price} />
       </p>
       </div>
       <hr className="my-4" />
       <div className="flex flex-col gap-y-6">
       
       
       <h3 className="font-semibold text-black">Description:</h3>
          <div className="flex items-center gap-x-1">
          {data.description}
          </div>
       
       <div className="flex items-center gap-x-4">
       
       <h3 className="font-semibold text-black">Taille:</h3>
       <div>
            {data?.size?.value}
          </div>
       </div>

       <div className="flex items-center gap-x-4">
       <h3 className="font-semibold text-black">Couleur:</h3>
       <div className="h-6 w-6 rounded-full border border-gray-600" style={{ backgroundColor: data?.color?.value }} />
       </div>
       </div>
       <div className="mt-10 flex items-center gap-x-3">
       <Button className="flex items-center gap-x-2">
       Ajouter au panier
       <ShoppingCart size={20}/>
       </Button>
       </div>
    </div>
   );
}
 
export default Info;