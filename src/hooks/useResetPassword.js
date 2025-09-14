import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../services/passwordService";
import { toast } from "sonner";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }) => resetPassword({ token, password }),
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successful!");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    },
  });
};
