import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function PaymentVerificationLoading() {
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-8 w-48 mx-auto mt-4" />
        </CardHeader>
        <CardContent className="text-gray-500 space-y-4">
          {/* ID de Pago */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          
          {/* Estado */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          
          {/* Banco */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-32" />
          </div>
          
          {/* Monto */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
          
          {/* Motivo */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-28" />
          </div>
          
          {/* Pagador */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-36" />
          </div>
          
          {/* Recuadro de acción */}
          <Skeleton className="h-32 w-full mt-6 rounded-lg" />
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    </div>
  );
}
