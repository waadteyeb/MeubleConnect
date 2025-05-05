"use client"

import { ColumnDef } from "@tanstack/react-table"

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
  paymentMethod:string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Produits",
  },
  {
    accessorKey: "phone",
    header: "Numéro de téléphone",
  },
  {
    accessorKey: "address",
    header: "Addresse",
  },
  {
    accessorKey: "totalPrice",
    header: "Total prix",
  },
  {
    accessorKey: "isPaid",
    header: "Payé",
  },
  {
    accessorKey: "paymentMethod",
    header: "Méthode de payement",
  },
];