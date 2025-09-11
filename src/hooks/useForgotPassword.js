import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api/passwordService";
import { toast } from "../components/ui/sonner";

export function useForgotPassword() {
  return useMutation((email) => forgotPassword(email), {
    onSuccess: (data) => {
      toast.success(data?.message || "Check your email for reset instructions");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    },
  });
}
