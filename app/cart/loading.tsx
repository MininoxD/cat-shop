"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartLoading() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          <ShoppingCart className="inline mr-2" size={24} />
          CARRITO DE COMPRAS
        </h1>
        <Link href="/">
          <Button variant="outline" className="cursor-pointer">
            <ArrowLeft className="mr-2" size={16} />
            Seguir comprando
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Lista de productos esqueleto */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-3 text-sm font-medium text-gray-500 mb-2 px-4">
            <span>Productos</span>
            <span className="text-center">Cantidad</span>
            <span className="text-right">Subtotal</span>
          </div>

          {/* Elementos de carga del carrito */}
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex items-center p-4 border rounded-lg bg-white"
              >
                <div className="flex flex-1 items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex-1 flex justify-center">
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="flex-1 flex justify-end">
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
        </div>

        {/* Resumen del carrito esqueleto */}
        <div className="bg-white border rounded-lg p-4 h-fit space-y-4">
          <h3 className="font-bold text-lg">Resumen del pedido</h3>

          <div className="flex justify-between items-center text-sm">
            <span>Productos</span>
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>Envío</span>
            <Skeleton className="h-4 w-16" />
          </div>

          <Separator />

          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <Skeleton className="h-6 w-20" />
          </div>

          <Skeleton className="h-10 w-full mt-6" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
