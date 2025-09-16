import { useState } from 'react';

export interface AuthFormData {
  email: string;
  password: string;
  name: string;
}

export interface PasswordValidation {
  isValid: boolean;
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export const useAuthForm = (isLogin: boolean = true) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: ''
  });

  const [errors, setErrors] = useState<Partial<AuthFormData>>({});

  // Password validation for registration
  const validatePassword = (password: string): PasswordValidation => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const isValid = Object.values(requirements).every(Boolean);

    return { isValid, requirements };
  };

  const passwordValidation = validatePassword(formData.password);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no es válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Contraseña es requerida';
    } else if (!isLogin && !passwordValidation.isValid) {
      newErrors.password = 'La contraseña no cumple con los requisitos';
    }

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Nombre es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '' });
    setErrors({});
  };

  const isFormValid = isLogin
    ? formData.email.trim() && formData.password.trim()
    : formData.email.trim() && formData.name.trim() && passwordValidation.isValid;

  return {
    formData,
    errors,
    passwordValidation,
    isFormValid,
    validateForm,
    updateField,
    resetForm,
    // Convenience getters
    email: formData.email,
    password: formData.password,
    name: formData.name,
    setEmail: (value: string) => updateField('email', value),
    setPassword: (value: string) => updateField('password', value),
    setName: (value: string) => updateField('name', value),
  };
};