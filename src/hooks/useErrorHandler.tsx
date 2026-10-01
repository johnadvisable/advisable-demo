import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

interface ErrorDetails {
  code?: string;
  message: string;
  details?: any;
  table?: string;
  operation?: string;
}

export function useUnifiedErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((error: any, context?: string): ErrorDetails => {
    console.error(`Error in ${context || 'operation'}:`, error);

    // Parse Supabase errors
    if (error?.code) {
      let userMessage = "An error occurred. Please try again.";
      
      switch (error.code) {
        case '23505': // Unique constraint violation
          userMessage = "This item already exists. Please check your data.";
          break;
        case '23503': // Foreign key violation
          userMessage = "Cannot delete this item as it's being used elsewhere.";
          break;
        case '42P01': // Table doesn't exist
          userMessage = "System error: Required data structure not found.";
          break;
        case 'PGRST116': // No rows found
          userMessage = "Item not found.";
          break;
        case '42883': // Function doesn't exist
          userMessage = "System error: Required function not available.";
          break;
        default:
          userMessage = error.message || "Database error occurred.";
      }

      toast({
        title: "Error",
        description: userMessage,
        variant: "destructive",
      });

      return {
        code: error.code,
        message: userMessage,
        details: error,
        operation: context
      };
    }

    // Handle general errors
    const errorMessage = error?.message || "An unexpected error occurred.";
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });

    return {
      message: errorMessage,
      details: error,
      operation: context
    };
  }, [toast]);

  const handleSuccess = useCallback((message: string, details?: string) => {
    toast({
      title: "Success",
      description: details || message,
    });
  }, [toast]);

  const handleWarning = useCallback((message: string, details?: string) => {
    toast({
      title: "Warning",
      description: details || message,
      variant: "destructive", // Using destructive for visibility
    });
  }, [toast]);

  return {
    handleError,
    handleSuccess,
    handleWarning
  };
}