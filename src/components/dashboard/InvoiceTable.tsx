import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash,
  CheckCircle,
  Mail,
  Calendar,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
}

interface InvoiceTableProps {
  invoices?: Invoice[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMarkAsPaid?: (id: string) => void;
  onSendReminder?: (id: string) => void;
}

const InvoiceTable = ({
  invoices = [
    {
      id: "1",
      invoiceNumber: "INV-001",
      customer: {
        name: "Acme Corp",
        email: "billing@acmecorp.com",
      },
      amount: 1250.0,
      status: "paid",
      date: "2023-05-15",
    },
    {
      id: "2",
      invoiceNumber: "INV-002",
      customer: {
        name: "Globex Inc",
        email: "accounts@globex.com",
      },
      amount: 3450.75,
      status: "pending",
      date: "2023-05-20",
    },
    {
      id: "3",
      invoiceNumber: "INV-003",
      customer: {
        name: "Stark Industries",
        email: "finance@stark.com",
      },
      amount: 7890.5,
      status: "overdue",
      date: "2023-04-30",
    },
    {
      id: "4",
      invoiceNumber: "INV-004",
      customer: {
        name: "Wayne Enterprises",
        email: "payments@wayne.com",
      },
      amount: 5250.25,
      status: "pending",
      date: "2023-05-25",
    },
    {
      id: "5",
      invoiceNumber: "INV-005",
      customer: {
        name: "Oscorp",
        email: "billing@oscorp.com",
      },
      amount: 2100.0,
      status: "paid",
      date: "2023-05-10",
    },
  ],
  onEdit = () => {},
  onDelete = () => {},
  onMarkAsPaid = () => {},
  onSendReminder = () => {},
}: InvoiceTableProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "secondary";
      case "pending":
        return "default";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="w-full bg-white rounded-md shadow-sm border">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Invoices</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[40px] py-4">
              <input type="checkbox" className="rounded border-gray-300" />
            </TableHead>
            <TableHead className="py-4">
              Date
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              No
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              Status
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              Due by
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              Customer
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              Net
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              Gross
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              Dispatch
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="py-4">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableCell>
              <TableCell className="py-4 font-normal">{invoice.date}</TableCell>
              <TableCell className="py-4 font-normal">
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell className="py-4">
                <Badge className="rounded-full px-4 py-1 font-normal bg-green-100 text-green-800 hover:bg-green-100 border-0">
                  Complete
                </Badge>
              </TableCell>
              <TableCell className="py-4 font-normal">2024-10-20</TableCell>
              <TableCell className="py-4 font-normal">
                {invoice.customer.name}
              </TableCell>
              <TableCell className="py-4 font-normal">
                {formatCurrency(invoice.amount)}
              </TableCell>
              <TableCell className="py-4 font-normal">
                {formatCurrency(invoice.amount)}
              </TableCell>
              <TableCell className="py-4">
                <Calendar className="h-5 w-5" />
              </TableCell>
              <TableCell className="py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-10 w-10 p-0 rounded-full"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(invoice.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(invoice.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                    {invoice.status !== "paid" && (
                      <DropdownMenuItem
                        onClick={() => onMarkAsPaid(invoice.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Paid
                      </DropdownMenuItem>
                    )}
                    {invoice.status !== "paid" && (
                      <DropdownMenuItem
                        onClick={() => onSendReminder(invoice.id)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Reminder
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTable;
