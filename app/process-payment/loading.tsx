import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ProcessPaymentLoading() {
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-8 w-64 mx-auto mt-4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
          
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
          
          <Skeleton className="h-24 w-full rounded-lg" />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Skeleton className="h-10 w-40" />
        </CardFooter>
      </Card>
    </div>
  );
}
