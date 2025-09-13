import { useMutation } from '@tanstack/react-query';
import { passwordService } from '../services/passwordService';
import { toast } from 'sonner';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: passwordService.resetPassword,
    onSuccess: () => toast.success('Password reset successful!'),
    onError: (err) => {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    }
  });
};
