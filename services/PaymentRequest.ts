export interface PaymentRequest {
  // Campos requeridos
  amount: number | string;                          // El monto del cobro (ej: 1000)
  currency: "CLP" | "CLF" | "ARS" | "PEN" | "MXN" | "USD" | "EUR" | "BOB" | "COP"; // Código de moneda ISO-4217
  subject: string;                         // Motivo del cobro (máx 255 caracteres)
  
  // Campos opcionales
  transaction_id?: string;                 // Identificador propio de la transacción (máx 255 caracteres)
  custom?: string;                         // Información personalizada (máx 1GB)
  body?: string;                           // Descripción del cobro (máx 5120 caracteres)
  bank_id?: string;                        // Identificador del banco (máx 5 caracteres)
  return_url?: string;                     // URL de retorno exitoso (máx 1024 caracteres)
  cancel_url?: string;                     // URL de cancelación (máx 1024 caracteres)
  picture_url?: string;                    // URL de imagen del producto (máx 1024 caracteres)
  notify_url?: string;                     // URL de webhook para notificaciones (máx 1024 caracteres)
  contract_url?: string;                   // URL del contrato PDF (máx 1024 caracteres)
  notify_api_version?: string;             // Versión de API de notificaciones (máx 255 caracteres)
  expires_date?: string;                   // Fecha de expiración (formato ISO-8601)
  send_email?: boolean;                    // Enviar solicitud por email
  payer_name?: string;                     // Nombre del pagador (máx 255 caracteres)
  payer_email?: string;                    // Email del pagador (máx 255 caracteres)
  send_reminders?: boolean;                // Enviar recordatorios de cobro
  responsible_user_email?: string;         // Email del responsable (máx 255 caracteres)
  fixed_payer_personal_identifier?: string; // Identificador personal del pagador (máx 255 caracteres)
  integrator_fee?: string;                 // Comisión para el integrador (máx 16 caracteres)
  collect_account_uuid?: string;           // UUID de la cuenta de cobro (máx 255 caracteres)
  confirm_timeout_date?: string;           // Fecha límite de confirmación (formato ISO-8601)
  mandatory_payment_method?: string;       // Método de pago obligatorio (máx 255 caracteres)
  psp_client_merchant_name?: string;       // Nombre del comercio final (entre 3-255 caracteres)
}
