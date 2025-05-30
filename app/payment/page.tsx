import CartDetail from "@/components/cart/cart-detail";
import {
  getPaymentService,
  getProductService,
  initializeServices,
} from "@/services/ServiceLocator";

export default async function PaymentPage({
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
  const paymentService = getPaymentService();
  const banks = await paymentService.getBanks();
  return (
    <CartDetail products={products} banks={banks} isPaymentEnabled={true} />
  );
}
