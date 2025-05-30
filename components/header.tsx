"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import Link from "next/link";

export function Header() {
  const { getTotalItems, items } = useCart();
  const totalItems = getTotalItems();

  return (
    <div className="w-full flex items-center gap-2 px-8">
      <h2 className="font-semibold text-gray-800">Cat Shop</h2>
      <Separator orientation="vertical" className="mr-4 h-4" />
      <Link
        href={{
          pathname: "/cart",
          query: {
            ids: items.map((item) => item.id),
          },
        }}
        className="relative ml-auto hover:bg-gray-200 rounded-full p-2 transition-colors cursor-pointer"
      >
        <ShoppingCart />
        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
          {totalItems}
        </Badge>
      </Link>
    </div>
  );
}
