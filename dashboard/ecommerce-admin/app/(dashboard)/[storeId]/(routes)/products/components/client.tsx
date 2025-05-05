"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Product} from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface ProductClientProps{
  data:ProductColumn[]
}

export const ProductClient:React.FC<ProductClientProps>=({
  data
})=>{
const router=useRouter();
const params =useParams();
return(
  
  <>
  <div className="flex items-center justify-between">
    <Heading
    title={`Produits(${data.length})`}
    description="Gérez les produits de votre store"
    />
    <Button onClick={()=>router.push(`/${params.storeId}/products/new`)}>
      <Plus className="mr-2 h-4 w-4"/>
      Ajouter nouveau
    </Button>
  </div>
  <Separator/>
  <DataTable searchKey="name" columns={columns} data={data}/>
  <Heading title="API" description="Appels d'API pour les produits"/>
  <Separator />
  <ApiList entityName="products" entityIdName="productId" />
  </>


)

}