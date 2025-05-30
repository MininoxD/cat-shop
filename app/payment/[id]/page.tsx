import {
  getPaymentService,
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
import {
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

// Definimos los tipos de parámetros que recibirá esta página
interface PaymentVerificationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PaymentVerificationPage({
  params,
}: PaymentVerificationPageProps) {
  // Inicializamos los servicios
  await initializeServices();
  const paymentService = getPaymentService();
  const { id } = await params;
  // Obtenemos el estado del pago usando el ID de la URL
  const paymentStatus = await paymentService.getPaymentStatus(id);

  // Determinamos el icono y color según el estado del pago
  let statusIcon;
  let statusColor;
  let statusText;

  if (paymentStatus.status === "done") {
    statusIcon = <CheckCircle size={40} className="text-green-500" />;
    statusColor = "bg-green-100";
    statusText = "Pago Completado";
  } else if (paymentStatus.status === "verifying") {
    statusIcon = <Clock size={40} className="text-amber-500" />;
    statusColor = "bg-amber-100";
    statusText = "Verificando Pago";
  } else {
    statusIcon = <AlertCircle size={40} className="text-amber-500" />;
    statusColor = "bg-amber-100";
    statusText = "Pago Pendiente";
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="text-center">
        <CardHeader>
          <div
            className={`w-20 h-20 ${statusColor} rounded-full flex items-center justify-center mx-auto`}
          >
            {statusIcon}
          </div>
          <CardTitle className="text-2xl mt-4">{statusText}</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-500">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">ID de Pago:</span>
            <code className="bg-gray-100 px-2 py-1 rounded border">
              {paymentStatus.payment_id}
            </code>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Estado:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                paymentStatus.status === "done"
                  ? "bg-green-100 text-green-800"
                  : paymentStatus.status === "verifying"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {paymentStatus.status === "done"
                ? "Completado"
                : paymentStatus.status === "verifying"
                ? "Verificando"
                : "Pendiente"}
            </span>
          </div>

          {paymentStatus.bank && (
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Banco:</span>
              <span>{paymentStatus.bank}</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Monto:</span>
            <span className="font-bold">
              {paymentStatus.currency} {paymentStatus.amount}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Motivo:</span>
            <span>{paymentStatus.subject}</span>
          </div>

          {paymentStatus.payer_name && (
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Pagador:</span>
              <span>{paymentStatus.payer_name}</span>
            </div>
          )}

          {paymentStatus.status === "pending" && paymentStatus.payment_url && (
            <div className="mt-6 p-4 border border-amber-200 bg-amber-50 rounded-lg">
              <p className="font-medium mb-2 text-amber-800">
                ¿Aún no has completado tu pago?
              </p>
              <a
                href={paymentStatus.payment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Continuar con el pago <ExternalLink size={16} />
              </a>
            </div>
          )}

          {paymentStatus.status === "done" && paymentStatus.receipt_url && (
            <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-lg">
              <p className="font-medium mb-2 text-green-800">
                Tu pago ha sido procesado correctamente
              </p>
              <a
                href={paymentStatus.receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Ver comprobante <ExternalLink size={16} />
              </a>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Volver a la tienda
            </Button>
          </Link>
          {paymentStatus.status === "done" && (
            <Link href="/cart">
              <Button>Ver mi carrito</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
