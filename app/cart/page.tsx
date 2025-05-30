import CartDetail from "@/components/cart/cart-detail";
import { getProductService, initializeServices } from "@/services/ServiceLocator";

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{
    ids?: string[];
  }>;
}) {
  await initializeServices();
  const { ids = [] } = await searchParams;
  const productService = getProductService();
  const products = await productService.getAll({
    ids,
  });
  return <CartDetail products={products} isPaymentEnabled={false} />;
}
