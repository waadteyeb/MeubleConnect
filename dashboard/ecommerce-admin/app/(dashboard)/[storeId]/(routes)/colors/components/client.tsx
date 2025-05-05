"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Color } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface ColorClientProps{
  data:ColorColumn[]
}

export const ColorClient:React.FC<ColorClientProps>=({
  data
})=>{
const router=useRouter();
const params =useParams();
return(
  
  <>
  <div className="flex items-center justify-between">
    <Heading
    title={`Couleurs(${data.length})`}
    description="Gérez les couleurs de votre produits"
    />
    <Button onClick={()=>router.push(`/${params.storeId}/colors/new`)}>
      <Plus className="mr-2 h-4 w-4"/>
      Ajouter nouveau
    </Button>
  </div>
  <Separator/>
  <DataTable searchKey="name" columns={columns} data={data}/>
  <Heading title="API" description="Appels d'API pour les couleurs"/>
  <Separator />
  <ApiList entityName="colors" entityIdName="colorId" />
  </>


)

}