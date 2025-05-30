import {
  getPaymentService,
  getProductService,
  initializeServices,
} from "@/services/ServiceLocator";
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
import { cookies } from "next/headers";
import { Transaction } from "@/domain/Transactions";
import UpdatePaymentPage from "@/components/payment/update-payment";
export default async function ProcessPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{
    id_transaction?: string;
  }>;
}) {
  await initializeServices();
  const cookieStore = await cookies();
  const { id_transaction } = await searchParams;

  const cookieTransactions = cookieStore.get("transactions");

  if (!cookieTransactions || !cookieTransactions.value) {
    console.error("No transactions cookie found");
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Ban size={40} className="text-red-500" />
            </div>
            <CardTitle className="text-2xl mt-4">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-500">
            <p>Transacción no encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const transactionData =
    (JSON.parse(cookieTransactions.value) as Transaction[]) || [];

  if (transactionData.length > 10) {
    console.log("Exedio el límite de 5 transacciones");
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Ban size={40} className="text-red-500" />
            </div>
            <CardTitle className="text-2xl mt-4">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-500">
            <p>Excediste el límite de transacciones permitidas en 1 día.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const transaction = transactionData.find(
    (transaction) => transaction.id === id_transaction
  );

  if (!transaction) {
    console.error("Transaction not found in cookie");
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Ban size={40} className="text-red-500" />
            </div>
            <CardTitle className="text-2xl mt-4">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-500">
            <p>Transacción no encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (transaction.status === "completed") {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <CardTitle className="text-2xl mt-4">
              Tu pago ya fue procesado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-500">
            <p>Tu pago ya ha sido completado exitosamente.</p>
            <p className="mt-2">
              Puedes verificar el estado de tu pago en cualquier momento usando
              el ID proporcionado.
            </p>
            <Link
              href={`/payment/${transaction?.payment_id}`}
              className="mt-2 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Verificar estado del pago{" "}
              <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const productService = getProductService();
  const products = await productService.getAll({
    ids: transaction.order.map((item) => item.id),
  });
  const paymentService = getPaymentService();
  const banks = await paymentService.getBanks();

  const totalPrice = products.reduce(
    (total, product) =>
      total +
      product.price *
        (transaction.order.find((item) => item.id === product.id)?.quantity ||
          1),
    0
  );
  const selectBank = banks.find((bank) => bank.bank_id === transaction.bank_id);

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
                <span className="font-bold">$ {selectBank.min_amount}</span>
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

  const paymentResponse = await paymentService.createPayment({
    amount: totalPrice,
    bank_id: selectBank.bank_id,
    subject: "Compra de productos",
    currency: "CLP",
    transaction_id: transaction.id,
  });

  const updatedStatusTransaction: Transaction = {
    ...transaction,
    payment_id: paymentResponse.payment_id,
    status: "completed",
  };

  const restTransactions = transactionData.filter(
    (transaction) => transaction.id !== id_transaction
  );
  const updatedTransactions = [...restTransactions, updatedStatusTransaction];
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
        <CardFooter className="flex flex-col">
          <UpdatePaymentPage transactions={updatedTransactions} />
        </CardFooter>
      </Card>
    </div>
  );
}
