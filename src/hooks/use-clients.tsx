import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Client, 
  getAllClients, 
  getClientCategories, 
} from "@/services/clients";
import { deleteClientCompletely } from "@/services/clients/clientMutations";

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const handleDeleteClient = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        const result = await deleteClientCompletely(id);
        
        if (result.success) {
          await fetchClients(); // Refresh the list
          toast({
            title: "Client deleted",
            description: "The client has been successfully deleted.",
          });
        } else {
          throw result.error;
        }
      } catch (error: any) {
        console.error('Error deleting client:', error);
        toast({
          title: "Error deleting client",
          description: error?.message || "An error occurred while deleting the client.",
          variant: "destructive",
        });
      }
    }
  };

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const fetchedClients = await getAllClients(currentLanguage); // Use current language context
      // Sort clients by display_order
      const sortedClients = [...fetchedClients].sort((a, b) => {
        const orderA = a.display_order !== undefined ? a.display_order : 0;
        const orderB = b.display_order !== undefined ? b.display_order : 0;
        return orderA - orderB;
      });
      setClients(sortedClients);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error fetching data",
        description: "Could not load clients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getClientCategories();
      setCategories(fetchedCategories);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error fetching categories",
        description: error.message || "Could not load categories",
        variant: "destructive",
      });
    }
  };

  const updateClientOrder = async (updatedClients: Client[]) => {
    try {
      setClients(updatedClients);
      toast({
        title: "Order updated",
        description: "Client display order has been updated.",
      });
    } catch (error: any) {
      console.error('Error updating client order:', error);
      toast({
        title: "Error updating order",
        description: "Failed to update client display order.",
        variant: "destructive",
      });
      await fetchClients(); // Refresh on error
    }
  };

  const moveClientToTop = async (clientId: string) => {
    try {
      const clientToMove = clients.find(c => c.id === clientId);
      if (!clientToMove) return;

      const otherClients = clients.filter(c => c.id !== clientId);
      const reorderedClients = [
        { ...clientToMove, display_order: 0 },
        ...otherClients.map((client, index) => ({
          ...client,
          display_order: index + 1
        }))
      ];

      await updateClientOrder(reorderedClients);
    } catch (error: any) {
      console.error('Error moving client to top:', error);
    }
  };

  const moveClientToBottom = async (clientId: string) => {
    try {
      const clientToMove = clients.find(c => c.id === clientId);
      if (!clientToMove) return;

      const otherClients = clients.filter(c => c.id !== clientId);
      const reorderedClients = [
        ...otherClients.map((client, index) => ({
          ...client,
          display_order: index
        })),
        { ...clientToMove, display_order: otherClients.length }
      ];

      await updateClientOrder(reorderedClients);
    } catch (error: any) {
      console.error('Error moving client to bottom:', error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchCategories();
  }, [currentLanguage]); // Re-fetch when language changes

  return {
    clients,
    categories,
    isLoading,
    fetchClients,
    fetchCategories,
    deleteClient: handleDeleteClient,
    updateClientOrder,
    moveClientToTop,
    moveClientToBottom
  };
};