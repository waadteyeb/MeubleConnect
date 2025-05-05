import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { string } from "zod";

export async function POST(
  req:Request,
  {params}:{params:{storeId:string}}
){
  try{ 
    const{userId}=auth();
    const body= await req.json();
    
    const {name,value}=body;

    if(!userId){
      return new NextResponse("Non authentifié",{status:401});
    }
    if(!name){
      return new NextResponse("Le nom de la taille est est requis",{status:400});
    }
    if(!value){
      return new NextResponse("La valeur de la taille est requise",{status:400});
    }
    if(!params.storeId){
      return new NextResponse("L'id du store est requis",{status:400});
    }

    const storeByUserId= await prismadb.store.findFirst({
      where:{
        id:params.storeId,
        userId
      }
    });
    if(!storeByUserId){
      return new NextResponse("Non autorisé",{status:400});

    }

    const size=await prismadb.size.create({
      data:{
        name,
        value,
        storeId:params.storeId

      }
    });

    return NextResponse.json(size);

  }catch(error){
    console.log('[SIZES_POST]',error);
    return new NextResponse("erreur interne",{status:500});
  }
}




export async function GET(
  req:Request,
  {params}:{params:{storeId:string}}
){
  try{ 
    if(!params.storeId){
      return new NextResponse("L'id du store est requis",{status:400});
    }

    

   const sizes=await prismadb.size.findMany({
      where:{
        storeId:params.storeId

      }
    });

    return NextResponse.json(sizes);

  }catch(error){
    console.log('[SIZES_GET]',error);
    return new NextResponse("erreur interne",{status:500});
  }
}