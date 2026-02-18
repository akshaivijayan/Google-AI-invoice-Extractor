
import { GoogleGenAI, Type } from "@google/genai";
import { InvoiceData } from "../types";

const INVOICE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    invoiceNumber: { type: Type.STRING, description: "Unique identifier for the invoice" },
    date: { type: Type.STRING, description: "Issue date of the invoice" },
    dueDate: { type: Type.STRING, description: "Due date for payment" },
    vendorName: { type: Type.STRING, description: "Name of the seller or company providing the service" },
    vendorAddress: { type: Type.STRING, description: "Full address of the vendor" },
    vendorPhone: { type: Type.STRING, description: "Contact phone of the vendor" },
    customerName: { type: Type.STRING, description: "Name of the buyer or client" },
    customerAddress: { type: Type.STRING, description: "Address of the customer" },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          unitPrice: { type: Type.NUMBER },
          total: { type: Type.NUMBER },
        },
        required: ["description", "total"],
      },
    },
    subtotal: { type: Type.NUMBER },
    taxAmount: { type: Type.NUMBER },
    totalAmount: { type: Type.NUMBER },
    currency: { type: Type.STRING, description: "Currency code (e.g., USD, EUR)" },
    paymentStatus: { type: Type.STRING, description: "Current status of payment if indicated" },
  },
  required: ["invoiceNumber", "vendorName", "totalAmount", "items"],
};

export const extractInvoiceData = async (
  fileData: string,
  mimeType: string,
  isText: boolean = false
): Promise<InvoiceData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `Act as an expert financial data extractor. Analyze the provided ${isText ? 'text' : 'document'} and extract all relevant invoice information accurately. Ensure numeric values are returned as numbers and dates are in a consistent YYYY-MM-DD format if possible.`;

  const config = {
    responseMimeType: "application/json",
    responseSchema: INVOICE_SCHEMA,
    temperature: 0.1, // Lower temperature for more consistent extraction
  };

  const model = "gemini-3-flash-preview";

  let response;

  if (isText) {
    response = await ai.models.generateContent({
      model,
      contents: `Context: ${prompt}\n\nInvoice Content:\n${fileData}`,
      config,
    });
  } else {
    response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: fileData,
            },
          },
        ],
      },
      config,
    });
  }

  const resultText = response.text;
  if (!resultText) {
    throw new Error("Failed to extract data from the invoice.");
  }

  return JSON.parse(resultText) as InvoiceData;
};
