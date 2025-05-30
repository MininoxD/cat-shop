// Define la estructura de un producto en la aplicación
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  stock?: number;
}

// Tipo para filtrar productos
export interface ProductFilter {
  ids?: string[];
  category?: string;
  query?: string;
}
