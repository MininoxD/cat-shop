"use client";

import Product from "@/components/product/product";
import { Product as ProductType } from "@/domain/Product";

interface PageProductsProps {
    products: Array<ProductType>
}
export default function PageProducts({ products }: PageProductsProps) {
  return (
    <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">Productos para tu felino</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Product
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </div>
  );
}