import { type FormEvent } from 'react';
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
        const result = await signIn({ email, password });
        if (result.success) {
          onSuccess?.();
        } else {
          alert(result.error?.message || 'Error al iniciar sesión');
        }
      } else {
        const result = await signUp({ email, password, name });
        if (result.success) {
          alert('Registro exitoso! Revisa tu email para confirmar tu cuenta y luego podrás completar tu perfil.');
          resetForm();
          onToggleMode(); // Switch to login mode
          onSuccess?.();
        } else {
          alert(result.error?.message || 'Error al crear la cuenta');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
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
        />

        {/* Password Requirements (solo para registro) */}
        {!isLogin && password && (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-gray-300 font-medium">Requisitos de contraseña:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${passwordValidation.requirements.minLength ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className={`text-xs ${passwordValidation.requirements.minLength ? 'text-green-300' : 'text-gray-300'}`}>
                  Mínimo 8 caracteres
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${passwordValidation.requirements.hasUpperCase ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className={`text-xs ${passwordValidation.requirements.hasUpperCase ? 'text-green-300' : 'text-gray-300'}`}>
                  Una mayúscula (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${passwordValidation.requirements.hasLowerCase ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className={`text-xs ${passwordValidation.requirements.hasLowerCase ? 'text-green-300' : 'text-gray-300'}`}>
                  Una minúscula (a-z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${passwordValidation.requirements.hasNumber ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className={`text-xs ${passwordValidation.requirements.hasNumber ? 'text-green-300' : 'text-gray-300'}`}>
                  Un número (0-9)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${passwordValidation.requirements.hasSpecialChar ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className={`text-xs ${passwordValidation.requirements.hasSpecialChar ? 'text-green-300' : 'text-gray-300'}`}>
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