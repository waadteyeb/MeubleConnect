"use client";

import axios from "axios";
import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { AlertModal } from "@/components/modals/alert-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SizeColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
interface CellActionProps {
  data: SizeColumn;
}



export const CellAction:React.FC<CellActionProps>=({
  data
})=>{
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);
      router.refresh();
      toast.success("Taille supprimée.");

      
    } catch (error) {
      toast.error("Assurez-vous d'abord d'avoir supprimé tous les produits de cette taille.");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };



  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID de la taille copié dans le presse-papiers.");
  }
  return(
    <>
     <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only"> Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4"/>
        </Button>

      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          Actions
        </DropdownMenuLabel>
        
        <DropdownMenuItem onClick={()=>onCopy(data.id)}>
          <Copy className="mr-2 h-4 w-4"/>
          copier l&apos;identifiant
        </DropdownMenuItem>
        <DropdownMenuItem  onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}>
          <Edit className="mr-2 h-4 w-4"/>
          mise à jour
        </DropdownMenuItem >
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <Trash className="mr-2 h-4 w-4"/>
          supprimer
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
}