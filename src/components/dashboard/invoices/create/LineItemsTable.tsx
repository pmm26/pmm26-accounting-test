import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

interface LineItemsTableProps {
  items?: LineItem[];
  onItemsChange?: (items: LineItem[]) => void;
  className?: string;
}

const LineItemsTable = ({
  items: initialItems = [
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
  onItemsChange = () => {},
  className = "",
}: LineItemsTableProps) => {
  const [items, setItems] = useState<LineItem[]>(initialItems);

  const calculateTotal = (quantity: number, unitPrice: number, tax: number) => {
    const subtotal = quantity * unitPrice;
    return subtotal + (subtotal * tax) / 100;
  };

  const handleAddItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      tax: 10,
      total: 0,
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: any) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate total if quantity, unitPrice or tax changes
        if (field === "quantity" || field === "unitPrice" || field === "tax") {
          updatedItem.total = calculateTotal(
            field === "quantity" ? value : item.quantity,
            field === "unitPrice" ? value : item.unitPrice,
            field === "tax" ? value : item.tax,
          );
        }

        return updatedItem;
      }
      return item;
    });

    setItems(updatedItems);
    onItemsChange(updatedItems);
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-6", className)}>
      <h2 className="text-lg font-semibold mb-4">Line Items</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Description
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Quantity
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Unit Price
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Tax (%)
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Total
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(item.id, "description", e.target.value)
                    }
                    placeholder="Enter description"
                    className="w-full"
                  />
                </td>
                <td className="py-3 px-4">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        "quantity",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    placeholder="0"
                    className="w-full"
                    min="0"
                  />
                </td>
                <td className="py-3 px-4">
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        "unitPrice",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    placeholder="0.00"
                    className="w-full"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="py-3 px-4">
                  <Select
                    value={item.tax.toString()}
                    onValueChange={(value) =>
                      handleItemChange(item.id, "tax", parseFloat(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select tax rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-3 px-4 font-medium">
                  ${item.total.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Button
          variant="outline"
          onClick={handleAddItem}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Line Item
        </Button>
      </div>

      <div className="mt-6 flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">
              $
              {items
                .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                .toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span className="font-medium">
              $
              {items
                .reduce((sum, item) => {
                  const subtotal = item.quantity * item.unitPrice;
                  return sum + (subtotal * item.tax) / 100;
                }, 0)
                .toFixed(2)}
            </span>
          </div>
          <div className="h-px bg-gray-200 my-2"></div>
          <div className="flex justify-between">
            <span className="text-gray-800 font-semibold">Total:</span>
            <span className="text-gray-800 font-semibold">
              ${items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineItemsTable;
