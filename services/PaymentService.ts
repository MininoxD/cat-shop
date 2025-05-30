import { PaymentRequest } from "@/services/PaymentRequest";
import { PaymentStatusResponse } from "@/services/PaymentStatusResponse";
import { Axios } from "axios";

export interface Bank {
  bank_id: string;
  name: string;
  message: string;
  min_amount: number;
  type: string;
  parent: string;
  logo_url: string;
}

export interface PaymentResponse {
  payment_id: string;
  payment_url: string;
  simplified_transfer_url?: string;
  transfer_url?: string;
  app_url?: string;
  ready_for_terminal?: boolean;
  notification_token?: string;
}

export class PaymentService {
  constructor(private readonly axiosInstance: Axios) {}
  async getBanks(): Promise<Bank[]> {
    const response = await this.axiosInstance.get<{
      banks: Bank[];
    }>("/banks");
    let data = response.data;
    if (typeof data === "string") {
      console.log("Received banks data as string, parsing it");
      try {
        const parsedData = JSON.parse(data);
        data = parsedData;
      } catch (error: unknown) {
        throw new Error(
          "Failed to parse banks data" +
            (error instanceof Error ? `: ${error.message}` : "")
        );
      }
    }

    return data.banks || [];
  }

  async createPayment(
    paymentRequest: PaymentRequest
  ): Promise<PaymentResponse> {
    try {
      const body = JSON.stringify(paymentRequest);
      const response = await this.axiosInstance.post<PaymentResponse>(
        "/payments",
        body
      );
      let data = response.data;
      if (typeof data === "string") {
        console.log("Received payment data as string, parsing it");
        try {
          const parsedData = JSON.parse(data);
          data = parsedData;
        } catch (error: unknown) {
          throw new Error(
            "Failed to parse payment response" +
              (error instanceof Error ? `: ${error.message}` : "")
          );
        }
      }
      console.log("Payment created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  }

  async getPaymentStatus(
    paymentId: string
  ): Promise<PaymentStatusResponse> {
    try {
      const response = await this.axiosInstance.get<PaymentStatusResponse>(
        `/payments/${paymentId}`
      );
      let data = response.data;
      if (typeof data === "string") {
        console.log("Received payment status data as string, parsing it");
        try {
          const parsedData = JSON.parse(data);
          data = parsedData;
        } catch (error: unknown) {
          throw new Error(
            "Failed to parse payment status response" +
              (error instanceof Error ? `: ${error.message}` : "")
          );
        }
      }
      return data;
    } catch (error) {
      console.error("Error fetching payment status:", error);
      throw error;
    }
  }
}
