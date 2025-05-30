export interface PaymentStatusResponse {
  // Identificador único del pago (cadena alfanumérica de 12 caracteres)
  payment_id: string;
  
  // URL principal del pago
  payment_url: string;
  
  // URL de pago simplificado
  simplified_transfer_url: string;
  
  // URL de pago normal
  transfer_url: string;
  
  // URL para invocar el pago desde dispositivo móvil usando APP de Khipu
  app_url: string;
  
  // Indica si el pago cuenta con todos los datos necesarios para abrir directamente la app de pagos
  ready_for_terminal: boolean;
  
  // Token de notificación para identificar el pago en notificaciones al servidor del comercio
  notification_token: string;
  
  // Identificador único de una cuenta de cobro
  receiver_id: number;
  
  // Fecha y hora de conciliación del pago (formato ISO-8601)
  conciliation_date: string;
  
  // Motivo del pago
  subject: string;
  
  // Monto del cobro
  amount: number;
  
  // Código de moneda en formato ISO-4217
  currency: string;
  
  // Estado del pago: pending, verifying o done
  status: 'pending' | 'verifying' | 'done';
  
  // Detalle del estado del pago
  status_detail: 'pending' | 'normal' | 'marked-paid-by-receiver' | 'rejected-by-payer' | 'marked-as-abuse' | 'reversed';
  
  // Detalle del cobro
  body: string;
  
  // URL con imagen del cobro
  picture_url: string;
  
  // URL del comprobante de pago
  receipt_url: string;
  
  // URL donde se redirige al pagador al terminar el pago
  return_url: string;
  
  // URL donde se redirige al pagador cuando desiste del pago
  cancel_url: string;
  
  // URL del webservice donde se notificará el pago
  notify_url: string;
  
  // Versión de la API de notificación
  notify_api_version: string;
  
  // Fecha máxima para ejecutar el pago (formato ISO-8601)
  expires_date: string;
  
  // Arreglo de URLs de archivos adjuntos al pago
  attachment_urls: string[];
  
  // Nombre del banco seleccionado por el pagador
  bank: string;
  
  // Identificador del banco seleccionado por el pagador
  bank_id: string;
  
  // Nombre del pagador
  payer_name: string;
  
  // Correo electrónico del pagador
  payer_email: string;
  
  // Identificador personal del pagador
  personal_identifier: string;
  
  // Número de cuenta bancaria del pagador
  bank_account_number: string;
  
  // Indica si la conciliación fue hecha después de la fecha de expiración
  out_of_date_conciliation: boolean;
  
  // Identificador del pago asignado por el cobrador
  transaction_id: string;
  
  // Campo genérico asignado por el cobrador al hacer el pago
  custom: string;
  
  // Correo electrónico de la persona responsable del pago
  responsible_user_email: string;
  
  // Indica si Khipu enviará recordatorios para este cobro por correo
  send_reminders: boolean;
  
  // Indica si Khipu enviará el cobro por correo electrónico
  send_email: boolean;
  
  // Método de pago usado por el pagador
  payment_method: 'regular_transfer' | 'simplified_transfer' | 'not_available';
  
  // Origen de fondos usado por el pagador
  funds_source: 'debit' | 'prepaid' | 'credit' | 'not-available' | '';
  
  // Monto a descontar del valor pagado (opcional)
  discount?: number;
  
  // Campo a ignorar
  third_party_authorization_details?: string;
}