"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex-1 p-6">
      <Skeleton className="h-8 w-64 mb-6" /> {/* Esqueleto para el título */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Generamos 6 esqueletos de productos */}
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border overflow-hidden flex flex-col"
            >
              {/* Esqueleto de la imagen */}
              <Skeleton className="h-48 w-full" />

              {/* Esqueleto del contenido */}
              <div className="p-4 flex flex-col gap-4">
                <Skeleton className="h-6 w-3/4" /> {/* Nombre del producto */}
                <Skeleton className="h-5 w-1/4" /> {/* Precio */}
                <div className="mt-auto">
                  <Skeleton className="h-10 w-full" /> {/* Botón */}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
