import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, X } from "lucide-react";

import { Client } from "@/lib/api";

interface ClientSectionProps {
  className?: string;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientType?: string;
  clients?: Client[];
  onClientChange?: (clientId: string) => void;
}

const ClientSection = ({
  className = "",
  clientId = "",
  clientName = "",
  clientEmail = "",
  clientPhone = "",
  clientAddress = "",
  clientType = "business",
  clients = [],
  onClientChange = () => {},
}: ClientSectionProps) => {
  return (
    <Card className={`w-full bg-white ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          Client Information
        </CardTitle>
        <div className="flex items-center space-x-2">
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            Add New Client
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select
            value={clientId}
            onValueChange={(value) => {
              onClientChange(value);
              // Find the selected client
              const selectedClient = clients.find(
                (client) => client.id === value,
              );
              if (selectedClient) {
                // You could update other client fields here if needed
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              placeholder="Enter client name"
              className="h-10"
              defaultValue={clientName || "Acme Corporation"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientType">Client Type</Label>
            <Select defaultValue={clientType}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select client type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="nonprofit">Non-Profit</SelectItem>
                <SelectItem value="government">Government</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email Address</Label>
            <Input
              id="clientEmail"
              type="email"
              placeholder="client@example.com"
              className="h-10"
              defaultValue={clientEmail || "contact@acmecorp.com"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone">Phone Number</Label>
            <Input
              id="clientPhone"
              placeholder="+1 (555) 123-4567"
              className="h-10"
              defaultValue={clientPhone || "+1 (555) 123-4567"}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="clientAddress">Billing Address</Label>
            <Input
              id="clientAddress"
              placeholder="Enter client address"
              className="h-10"
              defaultValue={
                clientAddress ||
                "123 Business Ave, Suite 100, San Francisco, CA 94107"
              }
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Recent Invoices</h4>
            <span className="text-xs text-gray-500">View All</span>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <p className="text-sm font-medium">INV-2023-001</p>
                <p className="text-xs text-gray-500">Due: May 15, 2023</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">$1,250.00</p>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Paid
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <p className="text-sm font-medium">INV-2023-002</p>
                <p className="text-xs text-gray-500">Due: June 1, 2023</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">$2,500.00</p>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientSection;
