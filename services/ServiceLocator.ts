import { PaymentService } from "@/services/PaymentService";
import { ProductService } from "./ProductService";
import { Axios } from "axios";
/**
 * Clase que implementa un patrón ServiceLocator para gestionar
 * instancias singleton de los servicios en el lado del servidor
 */
export class ServiceLocator {
  private static instance: ServiceLocator;
  private services: Map<string, unknown> = new Map();

  private constructor() {
    // Constructor privado para evitar instanciación directa
  }

  /**
   * Obtiene la instancia única del ServiceLocator
   */
  public static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }

  /**
   * Registra un servicio en el locator
   */
  public register<T>(serviceKey: string, service: T): void {
    this.services.set(serviceKey, service);
  }

  /**
   * Obtiene un servicio del locator
   */
  public get<T>(serviceKey: string): T {
    const service = this.services.get(serviceKey);
    if (!service) {
      throw new Error(`Service ${serviceKey} not found in ServiceLocator`);
    }
    return service as T;
  }

  /**
   * Verifica si un servicio está registrado
   */
  public has(serviceKey: string): boolean {
    return this.services.has(serviceKey);
  }
}

// Claves para identificar servicios
export const SERVICE_KEYS = {
  PRODUCT_SERVICE: "productService",
  PAYMENT_SERVICE: "paymentService",
};

/**
 * Inicializa todos los servicios como singletons en el ServiceLocator
 * Esta función debe ser llamada una sola vez en el layout del servidor
 */
export async function initializeServices() {
  const serviceLocator = ServiceLocator.getInstance();

  // Solo registra los servicios si aún no están registrados
  if (!serviceLocator.has(SERVICE_KEYS.PRODUCT_SERVICE)) {
    const productService = new ProductService();
    // Si el servicio necesita inicialización asíncrona, puedes hacerlo aquí
    // await productService.initialize();
    serviceLocator.register(SERVICE_KEYS.PRODUCT_SERVICE, productService);
  }

  if (!serviceLocator.has("paymentService")) {
    const url = process.env.PAYMENT_API_URL || "";
    const apiKey = process.env.PAYMENT_API_KEY || "";

    const instance = new Axios({
      baseURL: url,
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });
    const paymentService = new PaymentService(instance);
    serviceLocator.register(SERVICE_KEYS.PAYMENT_SERVICE, paymentService);
  }

  return serviceLocator;
}

export function getProductService(): ProductService {
  return ServiceLocator.getInstance().get<ProductService>(
    SERVICE_KEYS.PRODUCT_SERVICE
  );
}

export function getPaymentService(): PaymentService {
  return ServiceLocator.getInstance().get<PaymentService>(
    SERVICE_KEYS.PAYMENT_SERVICE
  );
}
