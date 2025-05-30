import {
  getPaymentService,
  getProductService,
  initializeServices,
} from "@/services/ServiceLocator";
import { v4 } from "uuid";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Ban,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function ProcessPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{
    ids?: string[];
    bank_id?: string;
  }>;
}) {
  await initializeServices();
  const { ids = [], bank_id } = await searchParams;
  const productService = getProductService();
  const products = await productService.getAll({
    ids,
  });
  const paymentService = getPaymentService();
  const banks = await paymentService.getBanks();

  const totalPrice = products.reduce(
    (total, product) => total + product.price,
    0
  );
  const selectBank = banks.find((bank) => bank.bank_id === bank_id);

  // Vista para banco no encontrado
  if (!selectBank) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Ban size={40} className="text-red-500" />
            </div>
            <CardTitle className="text-2xl mt-4">Banco no encontrado</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-500">
            <p>
              El banco seleccionado no se encuentra disponible en este momento o
              no existe en nuestro sistema.
            </p>
            <p className="mt-2">
              Por favor, regresa e intenta seleccionar otro banco para completar
              tu pago.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              href={{
                pathname: "/cart",
              }}
            >
              <Button className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Volver al carrito
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Vista para monto mínimo no alcanzado
  if (totalPrice < selectBank.min_amount) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={40} className="text-amber-500" />
            </div>
            <CardTitle className="text-2xl mt-4">
              Monto mínimo no alcanzado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-500">
            <p>
              El monto total de tu compra ($ {totalPrice.toFixed(2)}) es menor
              al mínimo requerido por {selectBank.name}.
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                {selectBank.logo_url && (
                  <Image
                    src={selectBank.logo_url}
                    alt={selectBank.name}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                )}
                <span className="font-medium">{selectBank.name}</span>
              </div>
              <p className="text-sm">
                Monto mínimo:{" "}
                <span className="font-bold">
                  $ {selectBank.min_amount.toFixed(2)}
                </span>
              </p>
            </div>
            <p className="mt-4">
              Por favor, añade más productos a tu carrito o selecciona otro
              banco.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              href={{
                pathname: "/cart",
              }}
            >
              <Button className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Volver al carrito
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Procesar el pago
  const paymentId = v4().toString();
  const paymentResponse = await paymentService.createPayment({
    amount: totalPrice,
    bank_id: selectBank.bank_id,
    subject: "Compra de productos",
    currency: "CLP",
    transaction_id: paymentId,
  });
  // Vista de pago exitoso
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <CardTitle className="text-2xl mt-4">
            ¡Pago creado con éxito!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-500">
          <p>
            Tu pago ha sido creado correctamente y está pendiente de
            confirmación.
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-gray-600" />
              <span className="font-medium text-gray-800">
                ID de Pago: {paymentResponse.payment_id}
              </span>
            </div>
          </div>{" "}
          <div className="mt-6 p-4 border border-amber-200 bg-amber-50 rounded-lg">
            <p className="font-medium mb-2 text-amber-800">Completar el Pago</p>
            <a
              href={paymentResponse.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Continuar con el pago <ExternalLink size={16} />
            </a>
          </div>
          <div className="mt-4 p-4 border border-amber-200 bg-amber-50 rounded-lg text-amber-800 text-sm">
            <p className="font-medium mb-1">Importante:</p>
            <p>Guarda este ID de pago para cualquier consulta o seguimiento.</p>
            <p className="mt-2">
              Puedes verificar el estado de tu pago en cualquier momento usando
              el ID proporcionado.
            </p>
            <Link
              href={`/payment/${paymentResponse.payment_id}`}
              className="mt-2 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Verificar estado del pago{" "}
              <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center gap-3 justify-center">
            <span>Pago creado a través de:</span>
            <div className="flex items-center gap-2">
              {selectBank.logo_url && (
                <Image
                  src={selectBank.logo_url}
                  alt={selectBank.name}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              )}
              <span className="font-medium">{selectBank.name}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
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
        </CardFooter>
      </Card>
    </div>
  );
}
