import { Product, ProductFilter } from "@/domain/Product";

const productData: Product[] = [
  {
    id: "1",
    name: "Collar para gato",
    price: 150,
    image:
      "https://i.imgur.com/a5F5Ocp.jpeg",
    description: "Collar elegante y cómodo para tu gato",
    category: "accesorios",
    stock: 10,
  },
  {
    id: "2",
    name: "Juguete interactivo",
    price: 120,
    image:
      "https://i.imgur.com/INmE4YG.jpeg",
    description: "Juguete interactivo para mantener a tu gato entretenido",
    category: "juguetes",
    stock: 15,
  },
  {
    id: "3",
    name: "Cama acogedora",
    price: 290,
    image:
      "https://i.imgur.com/Qc8jNdS.jpeg",
    description: "Cama súper cómoda para que tu gato descanse",
    category: "descanso",
    stock: 5,
  },
  {
    id: "4",
    name: "Comedero automático",
    price: 450,
    image:"https://i.imgur.com/ZbrLVOY.jpeg",
    description:
      "Comedero automático para alimentar a tu gato a horas programadas",
    category: "alimentación",
    stock: 8,
  },
  {
    id: "5",
    name: "Rascador vertical",
    price: 350,
    image:
      "https://i.imgur.com/pStJNwz.jpeg",
    description: "Rascador vertical con diferentes niveles para tu gato",
    category: "muebles",
    stock: 12,
  },
];

export class ProductService {
  async getAll(filter?: ProductFilter): Promise<Product[]> {

    await new Promise((resolve) => setTimeout(resolve, 1000)); 
    let filteredProducts = [...productData];

    if (filter?.ids && filter.ids.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        filter.ids!.includes(product.id)
      );
    }

    if (filter?.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === filter.category
      );
    }

    if (filter?.query) {
      const query = filter.query.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description &&
            product.description.toLowerCase().includes(query))
      );
    }

    return filteredProducts;
  }

  async getById(id: string): Promise<Product | undefined> {
    return productData.find((product) => product.id === id);
  }
}
