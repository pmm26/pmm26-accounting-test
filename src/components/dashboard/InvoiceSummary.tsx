import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InvoiceSummaryProps {
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  discount?: number;
  total?: number;
  className?: string;
}

const InvoiceSummary = ({
  subtotal = 1250.0,
  taxRate = 10,
  taxAmount = 125.0,
  discount = 50.0,
  total = 1325.0,
  className = "",
}: InvoiceSummaryProps) => {
  return (
    <Card className={cn("w-full max-w-md ml-auto bg-white", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Invoice Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Tax ({taxRate}%)</span>
            <span className="font-medium">${taxAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-red-500">
              -${discount.toFixed(2)}
            </span>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceSummary;
