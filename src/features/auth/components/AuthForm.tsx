import { type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Button, Input } from '../../../shared/components';
import { useAuth } from '../hooks/useAuth';
import { useAuthForm } from '../hooks/useAuthForm';

interface AuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onSuccess?: () => void;
}

export const AuthForm = ({ isLogin, onToggleMode, onSuccess }: AuthFormProps) => {
  const { signUp, signIn, isLoading } = useAuth();
  const {
    email,
    password,
    name,
    setEmail,
    setPassword,
    setName,
    errors,
    passwordValidation,
    isFormValid,
    validateForm,
    resetForm
  } = useAuthForm(isLogin);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isLogin) {
        const loadingToast = toast.loading('Iniciando sesión...');
        const result = await signIn({ email, password });
        toast.dismiss(loadingToast);

        if (result.success) {
          toast.success('¡Bienvenido de vuelta!');
          onSuccess?.();
        } else {
          toast.error(result.error?.message || 'Error al iniciar sesión');
        }
      } else {
        const loadingToast = toast.loading('Creando cuenta...');
        const result = await signUp({ email, password, name });
        toast.dismiss(loadingToast);

        if (result.success) {
          toast.success('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
          resetForm();
          onToggleMode(); // Switch to login mode
          onSuccess?.();
        } else {
          toast.error(result.error?.message || 'Error al crear la cuenta');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Ha ocurrido un error inesperado');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name field for registration */}
      {!isLogin && (
        <Input
          type="text"
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          required
          size="lg"
          error={errors.name}
        />
      )}

      {/* Email field */}
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        required
        size="lg"
        error={errors.email}
      />

      {/* Password field */}
      <div>
        <Input
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isLogin ? "Tu contraseña" : "Crea una contraseña segura"}
          required
          size="lg"
          error={errors.password}
          showPasswordToggle={true}
        />

        {/* Password Requirements (solo para registro) */}
        {!isLogin && password && (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-gray-700 font-medium">Requisitos de contraseña:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.minLength ? 'bg-green-500' : 'bg-gray-400'}`}>
                  {passwordValidation.requirements.minLength && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${passwordValidation.requirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                  Mínimo 8 caracteres
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.hasUpperCase ? 'bg-green-500' : 'bg-gray-400'}`}>
                  {passwordValidation.requirements.hasUpperCase && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${passwordValidation.requirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                  Una mayúscula (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.hasLowerCase ? 'bg-green-500' : 'bg-gray-400'}`}>
                  {passwordValidation.requirements.hasLowerCase && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${passwordValidation.requirements.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                  Una minúscula (a-z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.hasNumber ? 'bg-green-500' : 'bg-gray-400'}`}>
                  {passwordValidation.requirements.hasNumber && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${passwordValidation.requirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  Un número (0-9)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.hasSpecialChar ? 'bg-green-500' : 'bg-gray-400'}`}>
                  {passwordValidation.requirements.hasSpecialChar && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${passwordValidation.requirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                  Un símbolo (!@#$%...)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
      </Button>

    </form>
  );
};