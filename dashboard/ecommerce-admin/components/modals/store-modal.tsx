"use client"
import * as z from "zod";

import { useState } from "react";

import { useStoreModal } from "@/hooks/use-store-modal"
import {Modal} from "@/components/ui/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import axios from "axios";
import { toast } from "react-hot-toast";

const formSchema =z.object({
  name:z.string().min(1),
})

export const StoreModal= () =>{
  const storeModal=useStoreModal();

  const[loading,setLoading]=useState(false);

  const form=useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      name:"",
    }
  });
  const onSubmit=async(values:z.infer<typeof formSchema>)=>{
    try{
      setLoading(true);

      const response =await axios.post('/api/stores',values);
      
      window.location.assign(`/${response.data.id}`)
    }catch(error){
      toast.error("something went wrong");
    }finally{
      setLoading(false);
    }
  }
  return( 
  <Modal 
    title="créer votre Store"
    description="ajouter un nouveau store pour ajouter de nouveaux produits et catégories"
    isOpen={storeModal.isOpen}
    onClose={storeModal.onClose}
    >
      <div>
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
            control={form.control}
            name="name"
            render={({field})=>(
              <FormItem>
                <FormLabel>
                  Nom
                </FormLabel>
                <FormControl>
                  <Input 
                  disabled={loading} 
                  placeholder="E-commerce-store" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
            />

            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading}
                variant="outline"
                 onClick={storeModal.onClose}
                 >Annuler
                 </Button>
                <Button disabled={loading} type="submit">Continuer</Button>
            </div>

          </form>

        </Form>

      </div>
    </div>
    </Modal>
    );
 
}