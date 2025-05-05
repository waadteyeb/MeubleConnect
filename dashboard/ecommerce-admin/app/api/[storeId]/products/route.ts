import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name,description, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Non authentifié", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Le nom est requis", { status: 400 });
    }
    if (!description) {
      return new NextResponse("La description est requise", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Les images sont requises", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Le prix est requis", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("L'identifiant de la catégorie est requis", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("L'identifiant de couleur est requis", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("L'identifiant de taille est requis", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("L'identifiant du magasin est requis", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Non autorisé", { status: 405 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        description,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');
    const sort = searchParams.get('sort');
   

    if (!params.storeId) {
      return new NextResponse("L'identifiant du magasin est requis", { status: 400 });
    }
    const orderBy: any = {};

    if (sort === 'asc') {
      orderBy.price = 'asc'; // Sort by price in ascending order
    } else if (sort === 'desc') {
      orderBy.price = 'desc'; // Sort by price in descending order
    } else {
      orderBy.createdAt = 'desc'; // Default sorting by createdAt in descending order
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy
    });
  
    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};