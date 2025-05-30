"use client";

import Image from "next/image";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { Product as ProductProps } from "@/domain/Product";

export default function Product({
  id,
  name,
  price,
  image,
}: ProductProps) {
  const { addToCart } = useCart();
  
  return (
    <Card className="overflow-hidden w-full max-w-xs">
      <CardHeader>
        <div className="relative h-36 w-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover w-full h-36"
          />
        </div>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <Separator />
      <CardFooter className="flex justify-between items-center">
        <p className="font-bold text-lg">${price.toFixed(2)}</p>
        <Button
          onClick={() => addToCart(id)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 cursor-pointer"
        >
          <PlusCircle size={16} />
          Añadir
        </Button>
      </CardFooter>
    </Card>
  );
}
