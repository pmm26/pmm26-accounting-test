import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Calendar,
  DollarSign,
  User,
  FileText,
  Building,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateInvoiceDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreateInvoice?: (data: InvoiceFormData) => void;
}

interface InvoiceFormData {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  amount: string;
  dueDate: string;
  status: string;
  description: string;
}

const CreateInvoiceDialog = ({
  open = true,
  onOpenChange,
  onCreateInvoice = () => {},
}: CreateInvoiceDialogProps) => {
  const form = useForm<InvoiceFormData>({
    defaultValues: {
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: "",
      clientEmail: "",
      clientCompany: "",
      amount: "",
      dueDate: "",
      status: "draft",
      description: "",
    },
  });

  const handleSubmit = (data: InvoiceFormData) => {
    onCreateInvoice(data);
    onOpenChange?.(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-orange-600 hover:bg-orange-700 text-white"
          asChild
        >
          <Link to="/create-invoice">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create new invoice
          </Link>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new invoice. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input placeholder="INV-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input className="pl-9" placeholder="0.00" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input className="pl-9" type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Client Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            className="pl-9"
                            placeholder="John Doe"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="client@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clientCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Company</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          className="pl-9"
                          placeholder="Company Name"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Textarea
                        className="pl-9 min-h-[100px]"
                        placeholder="Enter invoice details..."
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Add any additional information about this invoice.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Invoice</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
