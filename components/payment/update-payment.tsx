"use client";

import { Button } from "@/components/ui/button";
import { Transaction } from "@/domain/Transactions";
import { useCart } from "@/providers/CartProvider";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface UpdatePaymentProps {
  transactions: Array<Transaction>;
}
export default function UpdatePaymentPage({
  transactions,
}: UpdatePaymentProps) {
  const { clearCart } = useCart();
  const updateCookie = async () => {
    if (typeof window !== "undefined") {
      document.cookie = `transactions=${JSON.stringify(
        transactions
      )}; path=/; SameSite=Lax`;
    }
  };

  useEffect(() => {
    updateCookie();
    clearCart();
  }, []);

  return (
    <div className="flex justify-center gap-4">
      <Link
        href={{
          pathname: "/cart",
        }}
      >
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Volver al carrito
        </Button>
      </Link>
      <Link
        href={{
          pathname: "/",
        }}
      >
        <Button>Seguir comprando</Button>
      </Link>
    </div>
  );
}
