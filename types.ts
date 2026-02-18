
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  vendorName: string;
  vendorAddress: string;
  vendorPhone?: string;
  customerName: string;
  customerAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  paymentStatus?: string;
}

export type ExtractionStatus = 'idle' | 'processing' | 'success' | 'error';

export interface FileInfo {
  name: string;
  size: string;
  type: string;
  previewUrl?: string;
  content?: string; // For text files
}
