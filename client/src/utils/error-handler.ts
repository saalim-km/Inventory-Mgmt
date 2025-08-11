import { AxiosError } from "axios";
import { toast } from "sonner";

export const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response) {
      const data = error.response.data;

      // Handle class-validator style validation errors (array of strings)
      if (data && Array.isArray(data.errors)) {
        const allErrors = data.errors.join("\n");
        toast.error(allErrors);
        return;
      }

      // Generic backend error message
      if (data && data.message) {
        toast.error(data.message);
        return;
      }

      // Specific known case
      if (error.code === "ERR_BAD_REQUEST") {
        toast.error("The request was invalid. Please check your input and try again.");
        return;
      }

      // Fallback
      toast.error("Something went wrong. Please try again.");
    } 
    
    else if (error.request) {
      console.error("Network error:", error.message);
      toast.error("Network error. Please check your connection.");
    } 
    
    else {
      console.error("Axios setup error:", error.message);
      toast.error("An error occurred while preparing the request.");
    }
  } 
  
  else {
    console.error("Unknown error:", error);
    toast.error("An unexpected error occurred.");
  }
};
