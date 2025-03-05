import React from "react";
import { Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceHeaderProps {
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  currency?: string;
  status?: string;
  className?: string;
  onFieldChange?: (field: string, value: string) => void;
}

const InvoiceHeader = ({
  invoiceNumber = "INV-001",
  invoiceDate = "",
  dueDate = "",
  currency = "USD",
  status = "draft",
  className = "",
  onFieldChange = () => {},
}: InvoiceHeaderProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="invoiceNumber"
              className="text-sm font-medium text-gray-700"
            >
              Invoice Number
            </Label>
            <Input
              id="invoiceNumber"
              value={invoiceNumber}
              className="mt-1 h-10"
              placeholder="INV-001"
              onChange={(e) => onFieldChange("invoiceNumber", e.target.value)}
            />
          </div>

          <div>
            <Label
              htmlFor="currency"
              className="text-sm font-medium text-gray-700"
            >
              Currency
            </Label>
            <Select
              value={currency}
              onValueChange={(value) => onFieldChange("currency", value)}
            >
              <SelectTrigger id="currency" className="mt-1 h-10">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="invoiceDate"
              className="text-sm font-medium text-gray-700"
            >
              Invoice Date
            </Label>
            <div className="relative">
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                className="mt-1 h-10 pl-10"
                placeholder="Select date"
                onChange={(e) => onFieldChange("invoiceDate", e.target.value)}
              />
              <Calendar className="absolute left-3 top-[18px] h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div>
            <Label
              htmlFor="dueDate"
              className="text-sm font-medium text-gray-700"
            >
              Due Date
            </Label>
            <div className="relative">
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                className="mt-1 h-10 pl-10"
                placeholder="Select date"
                onChange={(e) => onFieldChange("dueDate", e.target.value)}
              />
              <Clock className="absolute left-3 top-[18px] h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="paymentTerms"
              className="text-sm font-medium text-gray-700"
            >
              Payment Terms
            </Label>
            <Select
              value="net30"
              onValueChange={(value) => onFieldChange("paymentTerms", value)}
            >
              <SelectTrigger id="paymentTerms" className="mt-1 h-10">
                <SelectValue placeholder="Select terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due">Due on Receipt</SelectItem>
                <SelectItem value="net15">Net 15 Days</SelectItem>
                <SelectItem value="net30">Net 30 Days</SelectItem>
                <SelectItem value="net60">Net 60 Days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="invoiceStatus"
              className="text-sm font-medium text-gray-700"
            >
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => onFieldChange("status", value)}
            >
              <SelectTrigger id="invoiceStatus" className="mt-1 h-10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
