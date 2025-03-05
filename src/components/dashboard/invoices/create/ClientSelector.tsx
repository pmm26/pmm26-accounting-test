import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClients, type Client } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface ClientSelectorProps {
  value?: string;
  onValueChange: (value: string, client?: Client) => void;
  className?: string;
}

const ClientSelector = ({
  value = "",
  onValueChange,
  className = "",
}: ClientSelectorProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true);
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Error loading clients:", error);
        toast({
          title: "Error",
          description: "Failed to load clients. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, [toast]);

  const handleValueChange = (newValue: string) => {
    const selectedClient = clients.find((client) => client.id === newValue);
    onValueChange(newValue, selectedClient);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue
          placeholder={isLoading ? "Loading clients..." : "Select a client"}
        />
      </SelectTrigger>
      <SelectContent>
        {clients.map((client) => (
          <SelectItem key={client.id} value={client.id}>
            {client.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ClientSelector;
