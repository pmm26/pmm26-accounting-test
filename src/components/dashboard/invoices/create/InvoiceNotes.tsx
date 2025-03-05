import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceNotesProps {
  notes?: string;
  paymentTerms?: string;
  additionalInfo?: string;
  className?: string;
  onFieldChange?: (field: string, value: string) => void;
}

const InvoiceNotes = ({
  notes = "",
  paymentTerms = "net30",
  additionalInfo = "",
  className = "",
  onFieldChange = () => {},
}: InvoiceNotesProps) => {
  return (
    <Card className={`p-6 bg-white shadow-sm ${className}`}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Notes</h3>
          <Textarea
            placeholder="Add any notes or additional information for your client..."
            className="min-h-[100px] w-full"
            value={notes}
            onChange={(e) => onFieldChange("notes", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="payment-terms">Payment Terms</Label>
            <Select
              value={paymentTerms}
              onValueChange={(value) => onFieldChange("paymentTerms", value)}
            >
              <SelectTrigger id="payment-terms" className="mt-2">
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due-receipt">Due on Receipt</SelectItem>
                <SelectItem value="net15">Net 15 Days</SelectItem>
                <SelectItem value="net30">Net 30 Days</SelectItem>
                <SelectItem value="net45">Net 45 Days</SelectItem>
                <SelectItem value="net60">Net 60 Days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="additional-info">Additional Information</Label>
            <Textarea
              id="additional-info"
              placeholder="Payment instructions, bank details, etc."
              className="mt-2 min-h-[80px]"
              value={additionalInfo}
              onChange={(e) => onFieldChange("additionalInfo", e.target.value)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InvoiceNotes;
