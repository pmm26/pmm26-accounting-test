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

interface InvoiceFormProps {
  initialData?: {
    invoiceNumber?: string;
    invoiceDate?: string;
    dueDate?: string;
    currency?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    clientAddress?: string;
    clientType?: string;
    lineItems?: LineItem[];
    notes?: string;
    paymentTerms?: string;
    additionalInfo?: string;
  };
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}

const InvoiceForm = ({
  initialData = {},
  onSubmit = () => {},
  onCancel = () => {},
  className = "",
}: InvoiceFormProps) => {
  const [isPending, setIsPending] = useState(false);
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
    setIsPending(true);
    // Simulate API call
    setTimeout(() => {
      const formData = {
        ...initialData,
        lineItems,
        subtotal,
        taxAmount,
        discount,
        total,
      };
      onSubmit(formData);
      setIsPending(false);
    }, 1000);
  };

  const handleLineItemsChange = (updatedItems: LineItem[]) => {
    setLineItems(updatedItems);
  };

  return (
    <div className={`bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>

        <InvoiceHeader
          invoiceNumber={initialData.invoiceNumber}
          invoiceDate={initialData.invoiceDate}
          dueDate={initialData.dueDate}
          currency={initialData.currency}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ClientSection
              clientName={initialData.clientName}
              clientEmail={initialData.clientEmail}
              clientPhone={initialData.clientPhone}
              clientAddress={initialData.clientAddress}
              clientType={initialData.clientType}
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
          notes={initialData.notes}
          paymentTerms={initialData.paymentTerms}
          additionalInfo={initialData.additionalInfo}
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
