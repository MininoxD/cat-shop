"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { Product } from "@/domain/Product";

interface CartItemProps extends Product {
  quantity: number;
  isDisabled?: boolean;
}

export default function CartItem({
  id,
  name,
  price,
  image,
  quantity,
  isDisabled,
}: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex flex-col w-full bg-white rounded-lg overflow-hidden shadow-sm border">
      <div className="flex items-center p-4 gap-4">
        {/* Imagen del producto */}
        <div className="relative h-24 w-24 flex-shrink-0">
          <Image src={image} alt={name} fill className="object-cover rounded" />
        </div>

        {/* Información del producto */}
        <div className="flex flex-col flex-grow gap-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-800">{name}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-600 cursor-pointer"
              onClick={() => removeItem(id)}
              disabled={isDisabled}
            >
              <Trash2 size={18} />
            </Button>
          </div>

          <p className="text-sm text-gray-500">Vendido por: Cat Shop</p>

          <div className="flex justify-between items-center mt-2">
            {/* Controles de cantidad */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 cursor-pointer"
                onClick={() => updateQuantity(id, quantity - 1)}
                disabled={quantity <= 1 || isDisabled}
              >
                <MinusCircle size={16} />
              </Button>

              <span className="w-8 text-center">{quantity}</span>

              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 cursor-pointer"
                onClick={() => updateQuantity(id, quantity + 1)}
                disabled={isDisabled}
              >
                <PlusCircle size={16} />
              </Button>
            </div>

            {/* Precio */}
            <div className="text-right">
              <p className="font-bold">$ {(price * quantity).toFixed(2)}</p>
              <p className="text-xs text-gray-500">
                $ {price.toFixed(2)} por unidad
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
