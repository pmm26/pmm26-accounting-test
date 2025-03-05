import React, { useState } from "react";
import InvoiceHeader from "./InvoiceHeader";
import ClientSection from "./ClientSection";
import LineItemsTable from "./LineItemsTable";
import InvoiceSummary from "./InvoiceSummary";
import InvoiceNotes from "./InvoiceNotes";
import InvoiceActions from "./InvoiceActions";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

import { Client } from "@/lib/api";

interface InvoiceFormProps {
  initialData?: {
    invoiceNumber?: string;
    invoiceDate?: string;
    dueDate?: string;
    currency?: string;
    clientId?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    clientAddress?: string;
    clientType?: string;
    lineItems?: LineItem[];
    notes?: string;
    paymentTerms?: string;
    additionalInfo?: string;
    status?: string;
  };
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  className?: string;
  isPending?: boolean;
}

const InvoiceForm = ({
  initialData = {},
  onSubmit = () => {},
  onCancel = () => {},
  className = "",
  isPending = false,
}: InvoiceFormProps) => {
  const [formData, setFormData] = useState({
    invoiceNumber:
      initialData.invoiceNumber ||
      `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    invoiceDate:
      initialData.invoiceDate || new Date().toISOString().split("T")[0],
    dueDate:
      initialData.dueDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    currency: initialData.currency || "USD",
    status: initialData.status || "draft",
    clientId: initialData.clientId || "",
    clientName: initialData.clientName || "",
    clientEmail: initialData.clientEmail || "",
    clientPhone: initialData.clientPhone || "",
    clientAddress: initialData.clientAddress || "",
    clientType: initialData.clientType || "business",
    notes: initialData.notes || "",
    paymentTerms: initialData.paymentTerms || "net30",
    additionalInfo: initialData.additionalInfo || "",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>(
    initialData.lineItems || [
      {
        id: "1",
        description: "UX/UI Design",
        quantity: 10,
        unitPrice: 150,
        tax: 10,
        total: 1650,
      },
      {
        id: "2",
        description: "Web Development",
        quantity: 20,
        unitPrice: 100,
        tax: 10,
        total: 2200,
      },
    ],
  );

  // Calculate invoice totals
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const taxAmount = lineItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    return sum + (itemSubtotal * item.tax) / 100;
  }, 0);
  const discount = 50; // Example fixed discount
  const total = subtotal + taxAmount - discount;

  const handleSave = () => {
    console.log("Save button clicked");
    const submitData = {
      ...formData,
      lineItems,
      subtotal,
      taxAmount,
      discount,
      total,
    };
    console.log("Submitting data:", submitData);
    onSubmit(submitData);
  };

  const handleLineItemsChange = (updatedItems: LineItem[]) => {
    setLineItems(updatedItems);
  };

  const handleClientChange = (clientId: string, client?: Client) => {
    if (client) {
      setFormData((prev) => ({
        ...prev,
        clientId,
        clientName: client.name,
        clientEmail: client.email || "",
        clientPhone: client.phone || "",
        clientAddress: client.address || "",
        clientType: client.type || "business",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        clientId,
      }));
    }
  };

  const handleInvoiceHeaderChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotesChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={`bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>

        <InvoiceHeader
          invoiceNumber={formData.invoiceNumber}
          invoiceDate={formData.invoiceDate}
          dueDate={formData.dueDate}
          currency={formData.currency}
          status={formData.status}
          onFieldChange={handleInvoiceHeaderChange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ClientSection
              clientId={formData.clientId}
              clientName={formData.clientName}
              clientEmail={formData.clientEmail}
              clientPhone={formData.clientPhone}
              clientAddress={formData.clientAddress}
              clientType={formData.clientType}
              onClientChange={handleClientChange}
            />
          </div>

          <div className="lg:col-span-1">
            <InvoiceSummary
              subtotal={subtotal}
              taxAmount={taxAmount}
              discount={discount}
              total={total}
            />
          </div>
        </div>

        <LineItemsTable
          items={lineItems}
          onItemsChange={handleLineItemsChange}
        />

        <InvoiceNotes
          notes={formData.notes}
          paymentTerms={formData.paymentTerms}
          additionalInfo={formData.additionalInfo}
          onFieldChange={handleNotesChange}
        />

        <InvoiceActions
          onSave={handleSave}
          onCancel={onCancel}
          isPending={isPending}
          onSend={() => console.log("Send invoice")}
          onPreview={() => console.log("Preview invoice")}
          onDownload={() => console.log("Download invoice")}
          onPrint={() => console.log("Print invoice")}
        />
      </div>
    </div>
  );
};

export default InvoiceForm;
