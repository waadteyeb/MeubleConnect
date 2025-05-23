import{format} from "date-fns";
import { fr } from "date-fns/locale";

import prismadb from "@/lib/prismadb";
import { ColorClient } from "./components/client";
import { ColorColumn } from "./components/columns";

const ColorsPage= async({
  params
}:{
  params:{storeId:string}
})=>{
  const colors= await prismadb.color.findMany({
    where:{
      storeId:params.storeId
    },
    orderBy:{
      createdAt:'desc'
    }
  });

  const formattedSizes: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value:item.value,
    createdAt: format(item.createdAt, 'd MMMM yyyy', { locale: fr }),
  }));
  return(
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedSizes}/>
      </div>
    </div>
  )
};

export default ColorsPage; 