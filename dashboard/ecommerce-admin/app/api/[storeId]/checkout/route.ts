import axios from 'axios';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
  'Access-Control-Allow-Headers':
    'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization',
  'Access-Control-Max-Age': '3600',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      ...corsHeaders,
      'Content-Length': '0', // Include this header for preflight response
    },
  });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds, totalPriceInDinars } = await req.json();

  if (!productIds || productIds.length === 0 || !totalPriceInDinars) {
    return new NextResponse('Product ids and total price are required', {
      status: 400,
    });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  // Replace with your Konnect API endpoint
  const konnectApiUrl = 'https://api.preprod.konnect.network/api/v2/'; // Sandbox URL

  const konnectRequest = {
    receiverWalletId: '64f241d4db8e4d059624e185', // Replace with your receiver wallet ID
    token: 'TND',
    amount: totalPriceInDinars * 1000, // Convert to millimes (TND)
    type: 'immediate',
    description: 'Payment for products',
    acceptedPaymentMethods: ['wallet', 'bank_card', 'e-DINAR'],
    lifespan: 10,
    checkoutForm: true,
    addPaymentFeesToAmount: true,
    orderId: '1234657',
    silentWebhook: true,
    successUrl: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    failUrl: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    theme: 'light',
  };

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.API_KEY, 
  };

  try {
    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        paymentMethod: 'konnect',
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    // Make the Konnect payment request
    const konnectResponse = await axios.post(
      konnectApiUrl,
      konnectRequest,
      { headers }
    );

    return NextResponse.json(
      { url: konnectResponse.data.payUrl },
      {
        headers: {
          ...corsHeaders,
          // Other headers if needed
        },
      }
    );
  } catch (error) {
    console.error('Error creating Konnect payment:', error);
    return new NextResponse('Failed to create payment', { status: 500 });
  }
}
