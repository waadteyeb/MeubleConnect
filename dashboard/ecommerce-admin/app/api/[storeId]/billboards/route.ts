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
    
    const {label,imageUrl}=body;

    if(!userId){
      return new NextResponse("Non authentifié",{status:401});
    }
    if(!label){
      return new NextResponse("L'étiquette' est requise",{status:400});
    }
    if(!imageUrl){
      return new NextResponse("L'image est requise",{status:400});
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

    const billboard=await prismadb.billboard.create({
      data:{
        label,
        imageUrl,
        storeId:params.storeId

      }
    });

    return NextResponse.json(billboard);

  }catch(error){
    console.log('[BILLBOARDS_POST]',error);
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

    

   const billboards=await prismadb.billboard.findMany({
      where:{
        storeId:params.storeId

      }
    });

    return NextResponse.json(billboards);

  }catch(error){
    console.log('[BILLBOARDS_GET]',error);
    return new NextResponse("erreur interne",{status:500});
  }
}