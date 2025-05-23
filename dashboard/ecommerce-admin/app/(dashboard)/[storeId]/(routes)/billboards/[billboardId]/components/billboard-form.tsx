"use client";
import * as z from "zod";
import { Billboard } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

const formSchema=z.object({
  label:z.string().min(1),
  imageUrl:z.string().min(1),
});




type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormProps {
  initialData: Billboard| null;
};

export const BillboardForm: React.FC<BillboardFormProps>=({
  initialData
})=>{
  const params=useParams();
  const router=useRouter();
  


  const [open,setOpen]=useState(false);
  const [loading,setLoading]=useState(false);
  
  const title= initialData ? "Modifier le panneau d'affichage" :" Créer un panneau d'affichage";
  const description= initialData ? "Modifier le panneau d'affichage" :" Ajouter un nouveau panneau d'affichage";
  const toastMessage= initialData ? "Panneau d'affichage mis à jour." :" Panneau d'affichage crée.";
  const action= initialData ? "Sauvegarder les modifications" :" Créer";
  
  const form=useForm<BillboardFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData ||{
      label:'',
      imageUrl:'',
    }
  });

  const onSubmit= async (data:BillboardFormValues)=>{
    try{
      setLoading(true);
      if (initialData){
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`,data);
      }else{
        await axios.post(`/api/${params.storeId}/billboards`,data);
      }
      
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success(toastMessage)

    }catch(error){
      toast.error("something went wrong")

    }finally{
      setLoading(false);
    }

  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success('Panneau publicitaire supprimé.');
    } catch (error: any) {
      toast.error("Assurez-vous d'abord d'avoir supprimé tous catégories de ce panneau d'affichage .");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

return(
  <>
  <AlertModal
  isOpen={open}
  onClose={()=>setOpen(false)}
  onConfirm={onDelete}
  loading={loading}
  />
  <div  className="flex items-center justify-between">
    <Heading 
    title={title}
    description={description}
    />
  {initialData && (
  <Button
  disabled={loading}
  variant="destructive"
  size="icon"
  onClick={()=>setOpen(true)}
  >
    <Trash className="h-4 w-4"/>
  </Button>
  )}
  </div>
  <Separator/>
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
    <FormField
          control={form.control}
          name="imageUrl"
          render={({field})=>(
            <FormItem>
              <FormLabel>Image de fond</FormLabel>
              <FormControl>
                <ImageUpload 
                value={field.value ? [field.value]:[]}
                disabled={loading}
                onChange={(url)=>field.onChange(url)}
                onRemove={()=>field.onChange("")}
                />
              </FormControl>
              <FormMessage/>

            </FormItem>
          )
          
          }
        />
      <div className="grid grid-cols-3 gap-8">
        <FormField
         control={form.control}
         name="label"
         render={({field})=>(
          <FormItem>
            <FormLabel>Étiquette</FormLabel>
            <FormControl>
              <Input disabled={loading} placeholder="Étiquette de panneau d'affichage" {...field}/>
            </FormControl>
            <FormMessage/>

          </FormItem>
         )
         
         }
        />
      </div>
      <Button disabled={loading} className="ml-auto" type="submit">
        {action}
      </Button>

    </form>

  </Form>
  
  
  </>
)
};