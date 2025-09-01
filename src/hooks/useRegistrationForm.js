import { useState, useEffect } from 'react';
import { validateRegistrationForm } from '../utils/validationUtils';

export const useRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    setFormErrors(validateRegistrationForm(newFormData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validateRegistrationForm(formData));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log('Form data valid:', formData);
    }
  }, [formErrors, formData, isSubmit]);

  const isFormValid = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    return firstName && lastName && email && password && confirmPassword && 
           Object.keys(formErrors).length === 0;
  };

  return {
    formData,
    formErrors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    handleSubmit,
    isFormValid,
  };
};