import React from "react";
import { Button } from "@/components/ui/button";
import { Save, X, Send, Eye, Download, Printer } from "lucide-react";

interface InvoiceActionsProps {
  onSave?: () => void;
  onCancel?: () => void;
  onSend?: () => void;
  onPreview?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  isPending?: boolean;
  className?: string;
}

const InvoiceActions = ({
  onSave = () => {},
  onCancel = () => {},
  onSend = () => {},
  onPreview = () => {},
  onDownload = () => {},
  onPrint = () => {},
  isPending = false,
  className = "",
}: InvoiceActionsProps) => {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 bg-white p-4 ${className}`}
    >
      <div className="flex-1 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full"
          onClick={onCancel}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full"
          onClick={onPreview}
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full"
          onClick={onDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full"
          onClick={onPrint}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full"
          onClick={onSend}
        >
          <Send className="mr-2 h-4 w-4" />
          Send Invoice
        </Button>
        <Button
          size="lg"
          className="rounded-full bg-orange-600 hover:bg-orange-700 text-white"
          onClick={onSave}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default InvoiceActions;
