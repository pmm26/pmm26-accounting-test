import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import ClientSelector from "./ClientSelector";
import { Client, createClient } from "@/lib/api";

interface ClientSectionProps {
  className?: string;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientType?: string;
  onClientChange?: (clientId: string, client?: Client) => void;
}

const ClientSection = ({
  className = "",
  clientId = "",
  clientName = "",
  clientEmail = "",
  clientPhone = "",
  clientAddress = "",
  clientType = "business",
  onClientChange = () => {},
}: ClientSectionProps) => {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    type: "business",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleClientSelect = (value: string, client?: Client) => {
    onClientChange(value, client);
  };

  const handleNewClientChange = (field: string, value: string) => {
    setNewClient((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateClient = async () => {
    if (!newClient.name) {
      toast({
        title: "Error",
        description: "Client name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const createdClient = await createClient(newClient);
      toast({
        title: "Success",
        description: "Client created successfully",
      });
      setIsNewClientDialogOpen(false);
      setNewClient({
        name: "",
        email: "",
        phone: "",
        address: "",
        type: "business",
      });
      onClientChange(createdClient.id, createdClient);
    } catch (error) {
      console.error("Error creating client:", error);
      toast({
        title: "Error",
        description: "Failed to create client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`w-full bg-white ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          Client Information
        </CardTitle>
        <div className="flex items-center space-x-2">
          <button
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            onClick={() => setIsNewClientDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New Client
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <ClientSelector value={clientId} onValueChange={handleClientSelect} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              placeholder="Enter client name"
              className="h-10"
              value={clientName}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientType">Client Type</Label>
            <Input
              id="clientType"
              placeholder="Client type"
              className="h-10"
              value={clientType}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email Address</Label>
            <Input
              id="clientEmail"
              type="email"
              placeholder="client@example.com"
              className="h-10"
              value={clientEmail}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone">Phone Number</Label>
            <Input
              id="clientPhone"
              placeholder="+1 (555) 123-4567"
              className="h-10"
              value={clientPhone}
              readOnly
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="clientAddress">Billing Address</Label>
            <Input
              id="clientAddress"
              placeholder="Enter client address"
              className="h-10"
              value={clientAddress}
              readOnly
            />
          </div>
        </div>

        <Dialog
          open={isNewClientDialogOpen}
          onOpenChange={setIsNewClientDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Client</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newClientName">Client Name *</Label>
                  <Input
                    id="newClientName"
                    placeholder="Enter client name"
                    value={newClient.name}
                    onChange={(e) =>
                      handleNewClientChange("name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newClientType">Client Type</Label>
                  <Select
                    value={newClient.type}
                    onValueChange={(value) =>
                      handleNewClientChange("type", value)
                    }
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="newClientEmail">Email Address</Label>
                  <Input
                    id="newClientEmail"
                    type="email"
                    placeholder="client@example.com"
                    value={newClient.email}
                    onChange={(e) =>
                      handleNewClientChange("email", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newClientPhone">Phone Number</Label>
                  <Input
                    id="newClientPhone"
                    placeholder="+1 (555) 123-4567"
                    value={newClient.phone}
                    onChange={(e) =>
                      handleNewClientChange("phone", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newClientAddress">Billing Address</Label>
                  <Input
                    id="newClientAddress"
                    placeholder="Enter client address"
                    value={newClient.address}
                    onChange={(e) =>
                      handleNewClientChange("address", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewClientDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateClient} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Client"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ClientSection;
