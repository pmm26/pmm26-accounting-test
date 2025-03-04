import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import AddTransactionDialog from "./AddTransactionDialog";

interface TransactionHeaderProps {
  title?: string;
  onTransactionAdded?: () => void;
}

const TransactionHeader = ({
  title = "Transactions",
  onTransactionAdded,
}: TransactionHeaderProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex justify-between items-center p-4 bg-background border-b border-border">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">
          Manage your financial transactions
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        </DialogTrigger>
        <AddTransactionDialog
          open={open}
          onOpenChange={setOpen}
          onTransactionAdded={onTransactionAdded}
        />
      </Dialog>
    </div>
  );
};

export default TransactionHeader;
