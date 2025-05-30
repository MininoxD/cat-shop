"use client";

import { Product } from "@/domain/Product";
import { useCart } from "@/providers/CartProvider";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CartItem from "@/components/product/cart-item";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Transaction } from "@/domain/Transactions";
import { v4 } from "uuid";

interface Bank {
  bank_id: string;
  name: string;
  logo_url: string;
  min_amount: number;
}

interface CartDetailProps {
  products: Product[];
  banks?: Bank[];
  isPaymentEnabled?: boolean;
}

export default function CartDetail({
  products,
  banks,
  isPaymentEnabled,
}: CartDetailProps) {
  const idTransaction = v4();
  const { items, getTotalItems, clearCart } = useCart();
  const [selectedBank, setSelectedBank] = useState<string>("");
  const listBanks = banks || [];
  const totalItems = getTotalItems();
  const [isPaymentEnabledProcess, setIsPaymentEnabledProcess] =
    useState<boolean>(false);
  // Función para encontrar la información completa del producto desde las props
  const getProductInfo = (id: string): Product | undefined => {
    return products.find((product) => product.id === id);
  };
  // Calcular el total de la compra
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = getProductInfo(item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  useEffect(() => {
    if (selectedBank && isPaymentEnabled) {
      const totalAmount = calculateTotal();
      const bankSelected = listBanks.find(
        (bank) => bank.bank_id === selectedBank
      );
      if (totalAmount >= (bankSelected?.min_amount || 0)) {
        setIsPaymentEnabledProcess(true);
      }
    }
  }, [selectedBank]);

  const saveTransactionInCookie = async () => {
    const transaction: Transaction = {
      id: idTransaction,
      order: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      bank_id: selectedBank,
      created_at: new Date().toISOString(),
      status: "pending",
    };

    if (typeof window !== "undefined") {
      const cookieExists = document.cookie.includes("transactions=");
      // valida si existe ya existe un valor en la cookie con transactions que sea un array
      let existingTransactions = JSON.parse(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)transactions\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        ) || "[]"
      ) as Transaction[];
      // Si no es un array, inicializa como un array vacío
      if (!Array.isArray(existingTransactions)) {
        existingTransactions = [];
      }
      // Agrega la nueva transacción al array
      existingTransactions.push(transaction);
      const maxAge = 86400;

      if (!cookieExists) {
        document.cookie = `transactions=${JSON.stringify(
          existingTransactions
        )}; path=/; max-age=${maxAge}; SameSite=Lax`;
      } else {
        document.cookie = `transactions=${JSON.stringify(
          existingTransactions
        )}; path=/; SameSite=Lax`;
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <ShoppingCart size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-6">
          Añade productos para ver tu carrito
        </p>
        <Link href="/">
          <Button className="cursor-pointer">
            <ArrowLeft className="mr-2" size={16} />
            Volver a la tienda
          </Button>
        </Link>
      </div>
    );
  }

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
        {/* Lista de productos en el carrito */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-3 text-sm font-medium text-gray-500 mb-2 px-4">
            <span>Productos</span>
            <span className="text-center">Cantidad</span>
            <span className="text-right">Subtotal</span>
          </div>

          {items.map((item) => {
            const product = getProductInfo(item.id);
            if (!product) return null;

            return (
              <CartItem
                key={item.id}
                id={item.id}
                name={product.name}
                price={product.price}
                image={product.image}
                quantity={item.quantity}
                isDisabled={isPaymentEnabled}
              />
            );
          })}
        </div>

        {/* Resumen del carrito */}
        <div className="bg-white border rounded-lg p-4 h-fit space-y-4">
          <h3 className="font-bold text-lg">Resumen del pedido</h3>
          <div className="flex justify-between items-center text-sm">
            <span>Productos ({totalItems})</span>
            <span>$ {calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Envío</span>
            <span className="text-green-600">Gratis</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <span>$ {calculateTotal().toFixed(2)}</span>
          </div>
          {isPaymentEnabled && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">Selecciona un banco</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {listBanks.map((bank) => (
                  <div
                    key={bank.bank_id}
                    className={`border rounded-lg p-2 w-18 h-18 flex flex-col  items-center gap-1 cursor-pointer hover:border-primary transition-colors ${
                      selectedBank === bank.bank_id
                        ? "border-2 border-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedBank(bank.bank_id)}
                  >
                    {bank.logo_url && (
                      <Image
                        src={bank.logo_url}
                        alt={bank.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    )}
                    <span className="text-xs">{bank.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}{" "}
          {isPaymentEnabled ? (
            <div className="mt-4 text-sm text-gray-500">
              <p>
                Al proceder al pago, serás redirigido al portal del banco
                seleccionado para completar la transacción.
              </p>
              <p>Asegúrate de tener los datos de tu cuenta bancaria a mano.</p>
              {selectedBank && !isPaymentEnabledProcess ? (
                <p className="text-red-500 mt-2">
                  El monto total debe ser mayor o igual a{" "}
                  {listBanks.find((bank) => bank.bank_id === selectedBank)
                    ?.min_amount || 0}{" "}
                  para proceder con el pago.
                </p>
              ) : null}
              <Link
                href={{
                  pathname: "/process-payment",
                  query: {
                    id_transaction: idTransaction,
                  },
                }}
                onNavigate={() => saveTransactionInCookie()}
              >
                <Button
                  className="w-full mt-4 cursor-pointer"
                  disabled={!isPaymentEnabledProcess}
                >
                  Proceder al pago
                </Button>
              </Link>
            </div>
          ) : (
            <Link
              href={{
                pathname: "/payment",
                query: {
                  ids: items.map((item) => item.id),
                },
              }}
            >
              <Button className="w-full cursor-pointer">Pagar</Button>
            </Link>
          )}
          {!isPaymentEnabled && (
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={clearCart}
            >
              Vaciar carrito
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
